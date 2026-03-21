import React from 'react';

interface DebugOutputProps {
    obj: object;
}

export const DebugOutput: React.FC<DebugOutputProps> = ({obj}) => (
    <pre style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
        {JSON.stringify(obj, null, 2)}
    </pre>
);
