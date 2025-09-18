import { Component, effect, inject } from '@angular/core';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AnalysisProjectData } from '../../models/analysis-project';
import { ProjectCalcResults } from '../../models/project-calculator';
import { CommonModule } from '@angular/common';
import { NetBenefitCalculator } from '../../models/net-benefit-calculator';
import { NetBenfitPlotComponent } from '../net-benfit-plot/net-benfit-plot.component';

@Component({
  selector: 'app-project-stats-view',
  imports: [
    CommonModule,
    NetBenfitPlotComponent
  ],
  templateUrl: './project-stats-view.component.html',
  styleUrl: './project-stats-view.component.scss'
})
export class ProjectStatsViewComponent {
    readonly store = inject(ActiveProjectStore);
    /** The ID of the selected analysis project */
    private id: string | null | undefined;
    private project: AnalysisProjectData | null | undefined;
    private calcs: ProjectCalcResults | null | undefined;
    private _cost: number | null | undefined;
    private _benefit: number | null | undefined;
    private _benefitCost: number | null | undefined;

    get cost(): number | null | undefined {
        return this._cost;
    }
    get benefit(): number | null | undefined {
        return this._benefit;
    }
    get benefitCost(): number | null | undefined {
        return this._benefitCost
    }

    constructor() {
        this.watchDataChanges();
    }

    private watchDataChanges(): void {
        effect(() => {
            this.project = this.store.data();
            this.calcs = this.store.calcs();
            console.log('🤡 store data changed...', this.project, this.calcs);
            this.setData();
        });
    }

    private setData(): void {
        if (this.calcs) {
            this._cost = this.calcs.cost / Math.pow(10, 6);
            this._benefit = this.calcs.benefit / Math.pow(10, 6);
            this._benefitCost = this.calcs.benefitCost;
        }
        else {
            this._cost = undefined;
            this._benefit = undefined;
            this._benefitCost = undefined;
        }
        if (this.project) {
            const nb = NetBenefitCalculator.run(this.project);
            console.log(`🗿 net benefits:`, nb);
        }
    }
}
