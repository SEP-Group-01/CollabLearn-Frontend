import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Delete, Reply, ThumbUp, PushPin } from '@mui/icons-material';

interface MessageContextMenuProps {
  open: boolean;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  onLike: () => void;
  onPin?: () => void;
  canDelete: boolean;
  isPinned?: boolean;
}

export default function MessageContextMenu({
  open,
  anchorPosition,
  onClose,
  onReply,
  onDelete,
  onLike,
  canDelete
}: MessageContextMenuProps) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ? {
        top: anchorPosition.top,
        left: anchorPosition.left
      } : undefined}
    >
      <MenuItem onClick={() => { onReply(); onClose(); }}>
        <ListItemIcon>
          <Reply fontSize="small" />
        </ListItemIcon>
        <ListItemText>Reply</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { onLike(); onClose(); }}>
        <ListItemIcon>
          <ThumbUp fontSize="small" />
        </ListItemIcon>
        <ListItemText>Like</ListItemText>
      </MenuItem>
      {onPin && (
        <MenuItem onClick={() => { onPin(); onClose(); }}>
          <ListItemIcon>
            <PushPin fontSize="small" sx={{ 
              transform: isPinned ? 'rotate(45deg)' : 'none',
              transition: 'transform 0.2s ease-in-out'
            }} />
          </ListItemIcon>
          <ListItemText>{isPinned ? 'Unpin' : 'Pin'}</ListItemText>
        </MenuItem>
      )}
      {canDelete && (
        <MenuItem onClick={() => { onDelete(); onClose(); }}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}
