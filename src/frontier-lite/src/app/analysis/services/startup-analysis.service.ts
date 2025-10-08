import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ProjectCalculator } from '../models/project-calculator';
import { ProjectCalcResults } from '../models/analysis-project';

@Injectable({
    providedIn: 'root'
})
export class StartupAnalysisService {
    private dbService = inject(DatabaseService);

    async analyzeAllProjects(): Promise<void> {
        console.log('🚀 Starting analysis of all projects...');

        const projects = await this.dbService.getProjects();

        for (const project of projects.data || []) {
            try {
                const results = await this.dbService.getProject(project.id);
                const projectData = results.data;
                const newCalcs = ProjectCalculator.run(projectData?.threats || []);

                if (project.calc && this.shouldUpdateCalcs(project.calc, newCalcs)) {
                    await this.dbService.updateProjectCalc(project.id, newCalcs);
                    console.log(`✅ Updated calculations for project: ${project.name}`);
                }
            } catch (error) {
                console.error(`❌ Failed to analyze project ${project.name}:`, error);
            }
        }

        console.log('🎉 Completed analysis of all projects');
    }

    private shouldUpdateCalcs(existingCalcs: ProjectCalcResults | null | undefined, newCalcs: ProjectCalcResults): boolean {
        if (!existingCalcs) {
            return true;
        }

        return existingCalcs.cost !== newCalcs.cost ||
            existingCalcs.benefit !== newCalcs.benefit ||
            existingCalcs.benefitCost !== newCalcs.benefitCost;
    }
}
