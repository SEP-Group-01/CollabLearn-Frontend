import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Stack,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Topic as TopicIcon,
  Description as ResourceIcon,
} from '@mui/icons-material';
import type { WorkspaceWithThreads, ThreadWithResources, Resource } from '../api/studyPlanApi';

interface WorkspaceThreadSelectorProps {
  workspaces: WorkspaceWithThreads[];
  selectedResources: Set<string>;
  resourcesInActivePlans?: Set<string>; // Resources already in active study plans
  onResourceToggle: (resource: Resource, workspaceId: string, threadId: string) => void;
  onWorkspaceToggle: (workspaceId: string, select: boolean) => void;
  onThreadToggle: (workspaceId: string, threadId: string, select: boolean) => void;
  loading?: boolean;
}

const WorkspaceThreadSelector: React.FC<WorkspaceThreadSelectorProps> = ({
  workspaces,
  selectedResources,
  resourcesInActivePlans = new Set(), // Default to empty set
  onResourceToggle,
  onWorkspaceToggle,
  onThreadToggle,
  loading = false,
}) => {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  // Check if all resources in a thread are selected
  const isThreadFullySelected = (thread: ThreadWithResources): boolean => {
    if (!thread.resources || thread.resources.length === 0) return false;
    return thread.resources.every((resource) => selectedResources.has(resource.id));
  };

  // Check if some resources in a thread are selected
  const isThreadPartiallySelected = (thread: ThreadWithResources): boolean => {
    if (!thread.resources || thread.resources.length === 0) return false;
    const selected = thread.resources.filter((resource) => selectedResources.has(resource.id));
    return selected.length > 0 && selected.length < thread.resources.length;
  };

  // Check if all threads in a workspace are fully selected
  const isWorkspaceFullySelected = (workspace: WorkspaceWithThreads): boolean => {
    if (!workspace.threads || workspace.threads.length === 0) return false;
    return workspace.threads.every((thread) => isThreadFullySelected(thread));
  };

  // Check if some threads in a workspace are selected
  const isWorkspacePartiallySelected = (workspace: WorkspaceWithThreads): boolean => {
    if (!workspace.threads || workspace.threads.length === 0) return false;
    const hasAnySelected = workspace.threads.some(
      (thread) => isThreadFullySelected(thread) || isThreadPartiallySelected(thread)
    );
    return hasAnySelected && !isWorkspaceFullySelected(workspace);
  };

  // Count selected resources in workspace
  const countSelectedInWorkspace = (workspace: WorkspaceWithThreads): number => {
    return workspace.threads.reduce((count, thread) => {
      return count + thread.resources.filter((r) => selectedResources.has(r.id)).length;
    }, 0);
  };

  // Count selected resources in thread
  const countSelectedInThread = (thread: ThreadWithResources): number => {
    return thread.resources.filter((r) => selectedResources.has(r.id)).length;
  };

  const handleWorkspaceAccordion = (workspaceId: string) => {
    setExpandedWorkspaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  const handleThreadAccordion = (threadId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const handleWorkspaceCheckbox = (workspace: WorkspaceWithThreads, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onWorkspaceToggle(workspace.id, event.target.checked);
  };

  const handleThreadCheckbox = (workspaceId: string, thread: ThreadWithResources, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onThreadToggle(workspaceId, thread.id, event.target.checked);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Alert severity="info">
        No workspaces found. Join a workspace to start creating study plans.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Resources to Study
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select workspaces to auto-select all subscribed threads, or select individual threads and resources
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {workspaces.map((workspace) => {
          const isFullySelected = isWorkspaceFullySelected(workspace);
          const isPartiallySelected = isWorkspacePartiallySelected(workspace);
          const selectedCount = countSelectedInWorkspace(workspace);
          const totalThreads = workspace.threads.length;
          const totalResources = workspace.threads.reduce((acc, t) => acc + t.resources.length, 0);

          return (
            <Card key={workspace.id} variant="outlined">
              <Accordion
                expanded={expandedWorkspaces.has(workspace.id)}
                onChange={() => handleWorkspaceAccordion(workspace.id)}
                sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={2} width="100%">
                    <Checkbox
                      checked={isFullySelected}
                      indeterminate={isPartiallySelected}
                      onChange={(e) => handleWorkspaceCheckbox(workspace, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <FolderIcon color="primary" />
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {workspace.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {totalThreads} thread(s) • {totalResources} resource(s)
                      </Typography>
                    </Box>
                    {selectedCount > 0 && (
                      <Chip
                        label={`${selectedCount} selected`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1} pl={2}>
                    {workspace.threads.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No subscribed threads in this workspace
                      </Typography>
                    ) : (
                      workspace.threads.map((thread) => {
                        const threadFullySelected = isThreadFullySelected(thread);
                        const threadPartiallySelected = isThreadPartiallySelected(thread);
                        const threadSelectedCount = countSelectedInThread(thread);

                        return (
                          <Card key={thread.id} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                            <Accordion
                              expanded={expandedThreads.has(thread.id)}
                              onChange={() => handleThreadAccordion(thread.id)}
                              sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                            >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                                  <Checkbox
                                    checked={threadFullySelected}
                                    indeterminate={threadPartiallySelected}
                                    onChange={(e) => handleThreadCheckbox(workspace.id, thread, e)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <TopicIcon color="action" fontSize="small" />
                                  <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight="medium">
                                      {thread.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {thread.resources.length} resource(s)
                                    </Typography>
                                  </Box>
                                  {threadSelectedCount > 0 && (
                                    <Chip
                                      label={threadSelectedCount}
                                      size="small"
                                      color="secondary"
                                      sx={{ minWidth: 32 }}
                                    />
                                  )}
                                </Stack>
                              </AccordionSummary>

                              <AccordionDetails>
                                <Stack spacing={1} pl={2}>
                                  {thread.resources.length === 0 ? (
                                    <Typography variant="caption" color="text.secondary">
                                      No resources in this thread
                                    </Typography>
                                  ) : (
                                    thread.resources.map((resource) => {
                                      const isInActivePlan = resourcesInActivePlans.has(resource.id);
                                      return (
                                        <FormControlLabel
                                          key={resource.id}
                                          disabled={isInActivePlan}
                                          control={
                                            <Checkbox
                                              checked={selectedResources.has(resource.id)}
                                              onChange={() => onResourceToggle(resource, workspace.id, thread.id)}
                                              size="small"
                                              disabled={isInActivePlan}
                                            />
                                          }
                                          label={
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                              <ResourceIcon fontSize="small" color={isInActivePlan ? "disabled" : "action"} />
                                              <Box>
                                                <Typography 
                                                  variant="body2" 
                                                  sx={{ 
                                                    color: isInActivePlan ? 'text.disabled' : 'text.primary',
                                                    fontStyle: isInActivePlan ? 'italic' : 'normal'
                                                  }}
                                                >
                                                  {resource.title}
                                                  {isInActivePlan && (
                                                    <Chip 
                                                      label="In Active Plan" 
                                                      size="small" 
                                                      color="warning"
                                                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                                    />
                                                  )}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                  {resource.resource_type}
                                                  {resource.estimated_duration && ` • ${resource.estimated_duration} min`}
                                                </Typography>
                                              </Box>
                                            </Stack>
                                          }
                                        />
                                      );
                                    })
                                  )}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          </Card>
                        );
                      })
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Card>
          );
        })}
      </Stack>

      {/* Summary */}
      <Card sx={{ mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="subtitle2">
            Total Selected: {selectedResources.size} resource(s)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkspaceThreadSelector;
