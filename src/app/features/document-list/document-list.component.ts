import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { DocumentResponse } from '../../core/models/document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
    DatePipe, CurrencyPipe
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent implements OnInit {
  documents: DocumentResponse[] = [];
  loading = false;
  displayedColumns = ['originalFileName', 'documentType', 'vendor', 'totalAmount', 'status', 'uploadedAt'];

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.documentService.getAll().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load documents.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  openDetail(id: string): void {
    this.router.navigate(['/documents', id]);
  }
}
