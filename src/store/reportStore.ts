import { defineStore } from 'pinia';
import type { Report } from '@/types/types';

export const useReportStore = defineStore('report', {
    state: () => ({
        reports: [] as Report[]
    }),
    actions: {
        addReport(report: Report): void {
            this.reports.push(report);
        }
    }
});
