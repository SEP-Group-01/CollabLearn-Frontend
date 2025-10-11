# API Gateway Implementation for Real-time Collaboration

## Overview

This document outlines how to implement the API Gateway side for real-time collaborative editing using WebSockets.

## Architecture

```
Frontend (React + WebSocket) ↔ API Gateway ↔ Collaboration Service ↔ Database
```

## API Gateway WebSocket Handler

### 1. WebSocket Connection Handler

```javascript
// websocket-handler.js
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class CollaborationWebSocketServer {
  constructor() {
    this.wss = null;
    this.documents = new Map(); // documentId -> Set of clients
    this.clients = new Map(); // clientId -> client info
  }

  initialize(server) {
    this.wss = new WebSocket.Server({
      server,
      path: "/collaboration",
      verifyClient: this.verifyClient.bind(this),
    });

    this.wss.on("connection", this.handleConnection.bind(this));
  }

  verifyClient(info) {
    try {
      const url = new URL(info.req.url, "http://localhost");
      const token = url.searchParams.get("token");

      if (!token) {
        console.log("No token provided");
        return false;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      info.req.user = decoded;

      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }

  handleConnection(ws, req) {
    const url = new URL(req.url, "http://localhost");
    const params = url.searchParams;

    const clientId = uuidv4();
    const documentId = params.get("documentId");
    const userId = params.get("userId");
    const userName = params.get("userName");
    const userAvatar = params.get("userAvatar");
    const userColor = params.get("userColor");

    // Store client info
    const clientInfo = {
      id: clientId,
      ws,
      documentId,
      user: {
        id: userId,
        name: userName,
        avatar: userAvatar,
        color: userColor,
        isActive: true,
      },
      lastActivity: Date.now(),
    };

    this.clients.set(clientId, clientInfo);

    // Add client to document
    if (!this.documents.has(documentId)) {
      this.documents.set(documentId, new Set());
    }
    this.documents.get(documentId).add(clientId);

    console.log(`Client ${clientId} joined document ${documentId}`);

    // Set up message handler
    ws.on("message", (data) => {
      this.handleMessage(clientId, data);
    });

    // Handle disconnect
    ws.on("close", () => {
      this.handleDisconnect(clientId);
    });

    // Send initial document state and user list
    this.sendDocumentState(clientId);
    this.broadcastUserUpdate(documentId);

    // Set up ping/pong for connection health
    ws.on("pong", () => {
      clientInfo.lastActivity = Date.now();
    });
  }

  handleMessage(clientId, data) {
    try {
      const message = JSON.parse(data);
      const client = this.clients.get(clientId);

      if (!client) return;

      client.lastActivity = Date.now();

      switch (message.type) {
        case "join":
          // Already handled in connection
          break;

        case "content-update":
          this.handleContentUpdate(clientId, message);
          break;

        case "cursor-update":
          this.handleCursorUpdate(clientId, message);
          break;

        case "awareness-update":
          this.handleAwarenessUpdate(clientId, message);
          break;

        case "ping":
          client.ws.pong();
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  handleContentUpdate(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Save to database (implement your persistence logic)
    this.saveDocumentContent(
      client.documentId,
      message.data.content,
      client.user.id
    );

    // Broadcast to other clients in the same document
    this.broadcastToDocument(
      client.documentId,
      {
        type: "content-update",
        documentId: client.documentId,
        userId: client.user.id,
        data: message.data,
        timestamp: Date.now(),
      },
      clientId
    );
  }

  handleCursorUpdate(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Update client cursor position
    client.user.cursor = message.data.cursor;

    // Broadcast cursor position to other clients
    this.broadcastToDocument(
      client.documentId,
      {
        type: "cursor-update",
        documentId: client.documentId,
        userId: client.user.id,
        data: message.data,
        timestamp: Date.now(),
      },
      clientId
    );
  }

  handleAwarenessUpdate(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Update user awareness state
    client.user.isActive = message.data.user.isActive;

    // Broadcast user update
    this.broadcastUserUpdate(client.documentId);
  }

  broadcastToDocument(documentId, message, excludeClientId = null) {
    const documentClients = this.documents.get(documentId);
    if (!documentClients) return;

    for (const clientId of documentClients) {
      if (clientId === excludeClientId) continue;

      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }

  broadcastUserUpdate(documentId) {
    const documentClients = this.documents.get(documentId);
    if (!documentClients) return;

    const users = [];
    for (const clientId of documentClients) {
      const client = this.clients.get(clientId);
      if (client) {
        users.push(client.user);
      }
    }

    this.broadcastToDocument(documentId, {
      type: "user-update",
      documentId,
      data: { users },
      timestamp: Date.now(),
    });
  }

  sendDocumentState(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Load document from database
    this.loadDocumentContent(client.documentId)
      .then((content) => {
        const documentClients = this.documents.get(client.documentId);
        const users = [];

        for (const cId of documentClients) {
          const c = this.clients.get(cId);
          if (c && c.id !== clientId) {
            users.push(c.user);
          }
        }

        client.ws.send(
          JSON.stringify({
            type: "document-state",
            documentId: client.documentId,
            data: { content, users },
            timestamp: Date.now(),
          })
        );
      })
      .catch((error) => {
        console.error("Error loading document:", error);
      });
  }

  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log(
      `Client ${clientId} disconnected from document ${client.documentId}`
    );

    // Remove from document
    const documentClients = this.documents.get(client.documentId);
    if (documentClients) {
      documentClients.delete(clientId);

      // If no more clients, remove document
      if (documentClients.size === 0) {
        this.documents.delete(client.documentId);
      } else {
        // Broadcast user update
        this.broadcastUserUpdate(client.documentId);
      }
    }

    // Remove client
    this.clients.delete(clientId);
  }

  // Database operations (implement according to your DB)
  async saveDocumentContent(documentId, content, userId) {
    try {
      // Example with PostgreSQL
      const query = `
        UPDATE documents 
        SET content = $1, updated_at = CURRENT_TIMESTAMP, last_edited_by = $2
        WHERE id = $3
      `;
      await db.query(query, [content, userId, documentId]);

      // Also save to document history/versions if needed
      const historyQuery = `
        INSERT INTO document_history (document_id, content, edited_by, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `;
      await db.query(historyQuery, [documentId, content, userId]);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }

  async loadDocumentContent(documentId) {
    try {
      const query = "SELECT content FROM documents WHERE id = $1";
      const result = await db.query(query, [documentId]);
      return result.rows[0]?.content || "";
    } catch (error) {
      console.error("Error loading document:", error);
      return "";
    }
  }

  // Health check - remove inactive clients
  startHealthCheck() {
    setInterval(() => {
      const now = Date.now();
      const timeout = 60000; // 1 minute

      for (const [clientId, client] of this.clients) {
        if (now - client.lastActivity > timeout) {
          console.log(`Removing inactive client ${clientId}`);
          client.ws.terminate();
          this.handleDisconnect(clientId);
        } else {
          // Send ping
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.ping();
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }
}

module.exports = CollaborationWebSocketServer;
```

### 2. Express Server Integration

```javascript
// server.js
const express = require("express");
const http = require("http");
const CollaborationWebSocketServer = require("./websocket-handler");

const app = express();
const server = http.createServer(app);

// Initialize collaboration WebSocket server
const collaborationWS = new CollaborationWebSocketServer();
collaborationWS.initialize(server);
collaborationWS.startHealthCheck();

// REST API routes
app.use("/api/documents", require("./routes/documents"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `WebSocket collaboration available at ws://localhost:${PORT}/collaboration`
  );
});
```

### 3. Database Schema

```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  workspace_id UUID REFERENCES workspaces(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_edited_by UUID REFERENCES users(id)
);

-- Document history for versioning
CREATE TABLE document_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  content TEXT,
  edited_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document permissions
CREATE TABLE document_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  user_id UUID REFERENCES users(id),
  permission_level VARCHAR(20) CHECK (permission_level IN ('read', 'write', 'admin')),
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_documents_workspace ON documents(workspace_id);
CREATE INDEX idx_document_history_document ON document_history(document_id);
CREATE INDEX idx_document_permissions_document ON document_permissions(document_id);
CREATE INDEX idx_document_permissions_user ON document_permissions(user_id);
```

### 4. REST API Endpoints

```javascript
// routes/documents.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Get document
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check permissions
    const hasAccess = await checkDocumentAccess(id, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const document = await getDocument(id);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create document
router.post("/", auth, async (req, res) => {
  try {
    const { title, workspaceId } = req.body;
    const userId = req.user.id;

    const document = await createDocument({
      title,
      workspaceId,
      createdBy: userId,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document metadata (not content - that's handled via WebSocket)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    const hasWriteAccess = await checkDocumentWriteAccess(id, userId);
    if (!hasWriteAccess) {
      return res.status(403).json({ error: "Write access denied" });
    }

    const document = await updateDocument(id, { title });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Environment Variables

```env
# .env
PORT=3001
JWT_SECRET=your-jwt-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=collablearn
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# WebSocket settings
WS_HEARTBEAT_INTERVAL=30000
WS_CLIENT_TIMEOUT=60000
WS_MAX_CONNECTIONS_PER_DOCUMENT=50
```

## Deployment Considerations

### 1. Scaling with Redis

For multiple server instances, use Redis for pub/sub:

```javascript
const redis = require('redis');
const publisher = redis.createClient();
const subscriber = redis.createClient();

// Broadcast across server instances
broadcastToDocument(documentId, message) {
  // Local broadcast
  this.localBroadcastToDocument(documentId, message);

  // Redis broadcast
  publisher.publish(`document:${documentId}`, JSON.stringify(message));
}
```

### 2. Load Balancing

Use sticky sessions or implement proper document-to-server routing.

### 3. Security

- Implement rate limiting
- Validate all incoming messages
- Sanitize content before saving
- Use HTTPS/WSS in production

### 4. Monitoring

- Track active connections
- Monitor message throughput
- Log collaboration events
- Set up alerts for connection failures

This implementation provides a robust foundation for real-time collaborative editing with proper authentication, persistence, and scalability considerations.
