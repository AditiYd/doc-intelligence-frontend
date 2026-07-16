import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressBarModule, MatSnackBarModule, MatIconModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.txt')) {
      this.snackBar.open('Only PDF and TXT files are supported.', 'Dismiss', { duration: 4000 });
      input.value = '';
      return;
    }
    this.selectedFile = file;
  }

  upload(): void {
    if (!this.selectedFile || this.uploading) return;
    this.uploading = true;
    this.documentService.upload(this.selectedFile).subscribe({
      next: (doc) => {
        this.uploading = false;
        this.router.navigate(['/documents', doc.id]);
      },
      error: () => {
        this.uploading = false;
        this.snackBar.open('Upload failed. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }
}
