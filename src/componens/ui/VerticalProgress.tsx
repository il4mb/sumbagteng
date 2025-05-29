import React from 'react';
import { Box, Typography, Step, StepLabel, Stepper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

interface ProgressStep {
    title: string;
    description: string;
}

interface ProgressTrackerProps {
    steps: ProgressStep[];
    currentStep: number;
}

export default function VerticalProgress({ steps, currentStep }: ProgressTrackerProps) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={currentStep - 1} orientation="vertical">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep - 1;
                    const isCurrent = index === currentStep - 1;

                    return (
                        <Step key={step.title} completed={isCompleted}>
                            <StepLabel
                                icon={
                                    isCompleted ? (
                                        <CheckCircleIcon color="success" />
                                    ) : isCurrent ? (
                                        <HourglassBottomIcon color="primary" />
                                    ) : (
                                        <RadioButtonUncheckedIcon color="disabled" />
                                    )
                                }>
                                <Typography variant="subtitle1" fontWeight="bold" fontSize={12}>
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize={10}>
                                    {step.description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
};

const progressSteps = [
    {
        title: 'Order Placed',
        description: 'your order are placed successfully'
    },
    {
        title: 'Order Accepted',
        description: 'Your order has been accepted by our executive'
    },
    {
        title: "It's Ready",
        description: 'Your order is marked as ready'
    },
    {
        title: 'Confirmed',
        description: 'You have confirmed the order'
    }
];

import { RequestStatus } from '@/types';
const StatusList = ["pending", "accepted", "ready", "completed"] as const;

export const StatusProgress = ({ status }: { status: RequestStatus }) => {
    const currentIndex = StatusList.indexOf(status) + 1;
    return (
        <VerticalProgress steps={progressSteps} currentStep={currentIndex} />
    );
}