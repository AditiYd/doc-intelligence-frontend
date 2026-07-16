import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { DocumentResponse } from '../../core/models/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatProgressSpinnerModule, MatDividerModule, MatSnackBarModule,
    DatePipe, CurrencyPipe
  ],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss'
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: DocumentResponse | null = null;
  loading = true;
  lineItemColumns = ['description', 'quantity', 'unitPrice', 'totalPrice'];

  private pollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.documentService.getById(id).subscribe({
      next: (doc) => {
        this.document = doc;
        this.loading = false;
        if (doc.status === 'PROCESSING') {
          this.startPolling(id);
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load document.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  private startPolling(id: string): void {
    this.pollSub = interval(3000).pipe(
      switchMap(() => this.documentService.getById(id)),
      takeWhile(doc => doc.status === 'PROCESSING', true)
    ).subscribe({
      next: (doc) => { this.document = doc; },
      error: () => {
        this.snackBar.open('Lost connection while polling.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  back(): void {
    this.router.navigate(['/documents']);
  }
}
