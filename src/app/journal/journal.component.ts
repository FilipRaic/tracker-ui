import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { JournalService } from '../service/journal.service';
import { JournalEntry } from '../model/JournalEntry';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  imports: [CommonModule, FormsModule], 
})
export class JournalComponent implements OnInit {
  entries: JournalEntry[] = [];
  selectedEntry: JournalEntry | null = null;
  newEntry: JournalEntry = { date: '', description: '' };

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.loadEntries();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const date = `${yyyy}-${mm}-${dd}`;
    this.journalService.getEntryByDate(date).subscribe({
    next: (entry) => {
      this.newEntry.date = entry.date;
      this.newEntry.description = entry.description;
    },
    error: () => {
      this.newEntry.date = date;
      this.newEntry.description = '';
    }
  });
  }

  loadEntries() {
    this.journalService.getAllEntries().subscribe(entries => {
      this.entries = entries.sort((a, b) => b.date.localeCompare(a.date));
    });
  }

  selectEntry(date: string) {
  this.journalService.getEntryByDate(date).subscribe(entry => {
    this.selectedEntry = entry;
  });
}

  addEntry() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  this.newEntry.date = `${yyyy}-${mm}-${dd}`;
  
  const existingEntry = this.entries.find(e => e.date === this.newEntry.date);

  if (existingEntry) {
    this.journalService.putEntry(this.newEntry).subscribe(() => {
      this.loadEntries();
    });
  } else {
    this.journalService.addEntry(this.newEntry).subscribe(() => {
      this.loadEntries();
    });
  }
}
}