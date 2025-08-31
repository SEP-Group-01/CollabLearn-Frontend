import React, { useRef } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';

import {
    CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

import type { DragDropImageUploadProps } from '../types/QuizInterfaces'

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
    onImageUpload,
    currentImage,
    label,
    fullWidth = false,
    height = '120px',
    dragOverId,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <Box
            sx={{
                border: '2px dashed',
                borderColor: isDragOver ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                bgcolor: isDragOver ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                minHeight: height,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                width: fullWidth ? '100%' : 'auto',
                '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                }
            }}
            onClick={handleClick}
            onDragOver={(e) => onDragOver(e, dragOverId)}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />
            
            {currentImage ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box sx={{ 
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 1
                    }}>
                        <img
                            src={URL.createObjectURL(currentImage)}
                            alt="Preview"
                            style={{
                                maxWidth: '120px',
                                maxHeight: '80px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
                        Click or drag to change
                    </Typography>
                </Box>
            ) : (
                <>
                    <CloudUploadIcon 
                        sx={{ 
                            fontSize: isDragOver ? 36 : 32, 
                            color: isDragOver ? 'primary.main' : 'text.secondary',
                            transition: 'all 0.2s ease-in-out'
                        }} 
                    />
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
                        {label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Click to browse or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        JPEG, PNG, GIF, WebP (Max 5MB)
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default DragDropImageUpload;