import React from 'react';
import { Button } from 'react-bootstrap';

const TaskStatusButtons = ({ task, onStatusUpdate, isLoading }) => {
  const isPending = task.status === 'PENDING' || task.status === 'New';
  const isInProgress = task.status === 'IN_PROGRESS';
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      {isPending && (
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('IN_PROGRESS')}
          disabled={isLoading}
        >
          Mark as In Progress
        </Button>
      )}
      
      {isPending && (
        <Button
          variant="outline-success"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('COMPLETED')}
          disabled={isLoading}
        >
          Mark as Completed
        </Button>
      )}
      
      {isInProgress && (
        <Button
          variant="outline-warning"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('PENDING')}
          disabled={isLoading}
        >
          Mark as Pending
        </Button>
      )}
      
      {isInProgress && (
        <Button
          variant="outline-success"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('COMPLETED')}
          disabled={isLoading}
        >
          Mark as Completed
        </Button>
      )}
      
      {isCompleted && (
        <Button
          variant="outline-warning"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('PENDING')}
          disabled={isLoading}
        >
          Mark as Pending
        </Button>
      )}
      
      {isCompleted && (
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => onStatusUpdate('IN_PROGRESS')}
          disabled={isLoading}
        >
          Mark as In Progress
        </Button>
      )}
    </div>
  );
};

export default TaskStatusButtons;