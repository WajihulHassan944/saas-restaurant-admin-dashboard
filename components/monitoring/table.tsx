"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { webhookLogsData, printerConnectivityLogsData } from "@/constants/integration";
import { Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogType = 'webhook' | 'printer';

const LogsTable = () => {
    const [activeTab, setActiveTab] = useState<LogType>('webhook');

    return (
        <div className="bg-white rounded-[14px] p-[24px] shadow-sm overflow-hidden">
            <div className="flex gap-6 mb-[24px] font-semibold">
                <button 
                    onClick={() => setActiveTab('webhook')}
                    className={cn('pb-2 truncate', activeTab === 'webhook' ? 'text-primary' : 'text-gray')}>
                    Webhook Logs
                </button>
                <button 
                    onClick={() => setActiveTab('printer')}
                    className={cn('pb-2 truncate', activeTab === 'printer' ? 'text-primary' : 'text-gray')}>
                    Printer Connectivity Logs
                </button>
            </div>
            <Table>
                {activeTab === 'webhook' ? <WebhookLogsTableHeader /> : <PrinterLogsTableHeader />}
                {activeTab === 'webhook' ? <WebhookLogsTableBody /> : <PrinterLogsTableBody />}
            </Table>
        </div>
    );
};

const WebhookLogsTableHeader = () => (
    <TableHeader>
        <TableRow className="border-none">
            <TableHead className="font-normal">Timestamp</TableHead>
            <TableHead className="font-normal">Event Type</TableHead>
            <TableHead className="font-normal">Status</TableHead>
            <TableHead className="font-normal">Response Code</TableHead>
            <TableHead className="font-normal">Retry Count</TableHead>
            <TableHead className="font-normal">Actions</TableHead>
        </TableRow>
    </TableHeader>
);

const WebhookLogsTableBody = () => (
    <TableBody>
        {webhookLogsData.map((log, i) => (
            <TableRow key={i} className="border-none h-[60px]">
                <TableCell className="text-xs">{log.timestamp}</TableCell>
                <TableCell>{log.eventType}</TableCell>
                <TableCell className={cn(log.status === 'Success' ? 'text-green' : 'text-primary')}>{log.status}</TableCell>
                <TableCell>{log.responseCode}</TableCell>
                <TableCell>{log.retryCount}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-gray p-2 border rounded-md w-fit">
                        <Eye size={16} />
                        {log.status === 'Failed' && (
                            <div className="border-l pl-2">
                                <RefreshCw size={14} />
                            </div>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
);

const PrinterLogsTableHeader = () => (
    <TableHeader>
        <TableRow className="border-none">
            <TableHead className="font-normal">Printer ID</TableHead>
            <TableHead className="font-normal">Restaurant</TableHead>
            <TableHead className="font-normal">Location</TableHead>
            <TableHead className="font-normal">Status</TableHead>
            <TableHead className="font-normal">Last Connected</TableHead>
            <TableHead className="font-normal">Error Message</TableHead>
        </TableRow>
    </TableHeader>
);

const PrinterLogsTableBody = () => (
    <TableBody>
        {printerConnectivityLogsData.map((log, i) => (
            <TableRow key={i} className="border-none h-[60px]">
                <TableCell>{log.printerId}</TableCell>
                <TableCell>{log.restaurant}</TableCell>
                <TableCell>{log.location}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.lastConnected}</TableCell>
                <TableCell className={cn(log.errorMessage !== '---' && 'text-primary')}>{log.errorMessage}</TableCell>
            </TableRow>
        ))}
    </TableBody>
);

export default LogsTable;
