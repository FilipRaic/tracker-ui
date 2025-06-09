import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../service/journal.service';
import { JournalEntry } from '../model/JournalEntry';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  imports: [CommonModule, FormsModule, TranslatePipe],
})
export class JournalComponent implements OnInit {
  entries: JournalEntry[] = [];
  selectedEntry: JournalEntry | null = null;
  newEntry: JournalEntry = { date: '', description: '' };
  entrySubmitted = false;

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

  deleteEntry() {
    if(this.selectedEntry!=null){
      var date=this.selectedEntry.date;
    this.journalService.deleteEntry(date).subscribe(() => {
      this.entries = this.entries.filter(e => e.date !== date);
      if (this.selectedEntry?.date === date) {
        this.selectedEntry = null;
      }
    });
  }
}

  addEntry() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  this.newEntry.date = `${yyyy}-${mm}-${dd}`;

  const existingEntry = this.entries.find(e => e.date === this.newEntry.date);

  const afterSave = () => {
    this.loadEntries();
    this.selectEntry(this.newEntry.date);
    this.entrySubmitted = true;

    setTimeout(() => this.entrySubmitted = false, 3000);
  };

  if (existingEntry) {
    this.journalService.putEntry(this.newEntry).subscribe(afterSave);
  } else {
    this.journalService.addEntry(this.newEntry).subscribe(afterSave);
  }
}
}
