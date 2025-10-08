import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AnalysisProjectData } from '../../models/analysis-project';
import { ProjectCalcResults } from '../../models/analysis-project';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NetBenefitCalculator } from '../../models/net-benefit-calculator';
import { Chart, Colors, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js'

// register the chart modules
Chart.register(
    Colors,
    LineController,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip
);

interface LegendItem {
    name: string;
    color: string;
}

@Component({
  selector: 'app-net-benfit-plot',
  imports: [
    CommonModule,
  ],
  providers: [
    DecimalPipe
  ],
  templateUrl: './net-benfit-plot.component.html',
  styleUrl: './net-benfit-plot.component.scss'
})
export class NetBenfitPlotComponent {
    readonly store = inject(ActiveProjectStore);
    private project: AnalysisProjectData | null | undefined;
    private calcs: ProjectCalcResults | null | undefined;
    public chart: any;
    @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

    constructor(
        private dp: DecimalPipe
    ) {
        this.watchDataChanges();
    }

    ngOnInit() {
        this.clearChart();
    }

    ngOnDestroy() {
        this.clearChart();
    }

    private watchDataChanges(): void {
        effect(() => {
            this.project = this.store.data();
            this.calcs = this.store.calcs();
            this.buildChart();
        });
    }

    private clearChart(): void {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = undefined;
    }

    private buildChart() {
        this.clearChart();
        if (!this.project) {
            return;
        }
        // const results = NetBenefitCalculator.run(this.project);
        // const withoutData = modelResults.data.total.costWithoutNominal.map(item => ({
        //     x: item.year,
        //     y: item.value
        // }))
        // const withData = modelResults.data.total.costWithNominal.map(item => ({
        //     x: item.year,
        //     y: item.value
        // }))
        // this.legendItems = [
        //     {
        //         name: 'Without Improvement',
        //         color: 'rgb(240, 151, 51)'
        //     },
        //     {
        //         name: 'With Improvement',
        //         color: 'rgb(44, 105, 176)'
        //     }
        // ]
        const netBefitResults = NetBenefitCalculator.run(this.project);
        console.log(`net benefit results`);
        console.log(netBefitResults);
        const benefitData = netBefitResults
            .map(item => ({x: item.year, y: item.benefit/1000000}))
            .slice(0, 20);
        const costData = netBefitResults
            // .map(item => [item.year, -1 * item.cost/1000000])
            .map(item => ({x: item.year, y: -1 * item.cost/1000000}))
            .slice(0, 20);
        const netBenefitData = netBefitResults
            .map(item => [item.year, item.netBenefit/1000000])
            .slice(0, 20);
        console.log(`🍯 benefitData`, benefitData);
        console.log(`🍯 costData`, costData);
        if (this.chart) {
            this.chart.data.datasets[0].data = benefitData;
            this.chart.data.datasets[1].data = costData;
            this.chart.data.datasets[2].data = netBenefitData;
            this.chart.update();
        }
        else {
            const data = {
                datasets: [
                    {
                        label: 'Benefits',
                        data: benefitData,
                        backgroundColor: 'rgb(240, 151, 51)',
                        borderColor: 'rgb(240, 151, 51)',
                        hoverOffset: 4
                    },
                    {
                        label: 'Costs',
                        data: costData,
                        backgroundColor: 'rgb(44, 105, 176)',
                        borderColor: 'rgb(44, 105, 176)',
                        hoverOffset: 4
                    },
                    {
                        label: 'Net Benefits',
                        data: netBenefitData,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        hoverOffset: 4
                    }
                ]
            };
            const config = {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            ticks: {
                                // don't include commas in the x-axis (year)
                                callback: function(value: any, index: any, ticks: any) {
                                    return value;
                                }
                            },
                            title: {
                                display: true,
                                text: 'Year'
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: '$'
                            },
                            ticks: {
                                // don't include commas in the x-axis (year)
                                callback: (value: number, index: any, ticks: any) => {
                                    // const scaledValue = value / 1000000;
                                    return this.dp.transform(value, '1.0-0') + 'M'
                                }
                            }

                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: (context: any) => {
                                    return context[0].parsed.x;
                                },
                                label: (context: any) => {
                                    return '$' + this.dp.transform(context.parsed.y, '1.0-0');
                                }
                            }
                        }
                    }
                },
            };

            //@ts-ignore
            this.chart = new Chart(this.chartCanvas.nativeElement, config)

        }
    }
}
