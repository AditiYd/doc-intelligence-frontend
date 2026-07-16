import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import { DocumentService } from '../../core/services/document.service';
import { StatsResponse } from '../../core/models/document.model';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, CurrencyPipe, KeyValuePipe, BaseChartDirective],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats: StatsResponse | null = null;
  loading = true;

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Document Count', backgroundColor: '#3f51b5' }]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#3f51b5', '#e91e63', '#009688', '#ff9800', '#9c27b0']
    }]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'right' } }
  };

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.documentService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        const labels = Object.keys(stats.byType);
        const counts = Object.values(stats.byType);
        this.barChartData = {
          labels,
          datasets: [{ data: counts, label: 'Document Count', backgroundColor: '#3f51b5' }]
        };
        this.doughnutChartData = {
          labels,
          datasets: [{
            data: counts,
            backgroundColor: ['#3f51b5', '#e91e63', '#009688', '#ff9800', '#9c27b0']
          }]
        };
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load stats.', 'Dismiss', { duration: 4000 });
      }
    });
  }
}
