import { Injectable } from '@angular/core';
import { Note } from "../interfaces/note.model";
import { FilterService } from "./filter.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  constructor(private filterService: FilterService){}

  getAll(): Note[] {
    return this.notes;
  }

  get(id: number): Note {
    return this.notes[id];
  }

  getId(note: Note): number {
    return this.notes.indexOf(note);
  }

  update(id: number, editNote: Note) {
    let note: Note = this.notes[id];
    note.title = editNote.title;
    note.body = editNote.body;
  }

  add(note: Note): number {
    //этот метод добавит заметку в массив заметок и вернет идентификатор заметки, где id = index
    let newLength: number = this.notes.push(note);
    return newLength - 1;
  }

  delete(id: number) {
    this.notes.splice(id, 1);
  }

  filter(filterValue: string): Note[] {
    let query: string = filterValue.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    //split up the search query into individual words
    let terms: string[] = query.split(/\W+/);
    //remove duplicate search terms
    terms = this.filterService.removeDuplicates(terms);
    //compile all relevant result into the allResults array
    terms.forEach(term => {
      let result: Note[] = this.filterService.relevantNote(this.notes, term);
      //append results to the allResults array
      allResults = [...allResults, ...result];
    })

    this.filteredNotes = this.filterService.removeDuplicates(allResults);

    //now sort by relevancy
    return this.filterService.sortByRelevance(allResults, this.filteredNotes);
  }
}
