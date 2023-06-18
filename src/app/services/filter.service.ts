import { Injectable } from '@angular/core';
import {Note} from "../interfaces/note.model";
import {IndexedObject} from "../interfaces/Indexed-object";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  constructor() { }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResult: Set<any> = new Set<any>();
    //loop through the input array and add the items to the set
    arr.forEach(e => uniqueResult.add(e));
    return Array.from(uniqueResult);
  }

  relevantNote(notes: Note[], query: string): Array<Note> {
    query = query.toLowerCase().trim();
    return notes.filter(note =>
      note.body.toLowerCase().includes(query) || note.title.toLowerCase().includes(query));
  }

  sortByRelevance(searchResult: Note[], filteredNotes: Note[]) {
    //this method will calculate the relevancy of a note based on the number of times is appears in the search results
    let noteCountObject: IndexedObject = {}; // format - key: value => NoteId: number (note object id: count)

    searchResult.forEach(note => {
      let noteId: number = this.getIdFromListNotes(searchResult, note);
      if(noteCountObject[noteId]) {
        noteCountObject[noteId] += 1;
      } else {
        noteCountObject[noteId] = 1;
      }
    })

    return filteredNotes.sort((firstNote: Note, secondNote: Note) => {
      let firstNoteId = this.getIdFromListNotes(searchResult, firstNote);
      let secondNoteId = this.getIdFromListNotes(searchResult, secondNote);

      let firstNoteCount = noteCountObject[firstNoteId];
      let secondNoteCount = noteCountObject[secondNoteId];
      return secondNoteCount - firstNoteCount;
    })
  }

  getIdFromListNotes(notes: Note[], note: Note): number {
    return notes.indexOf(note);
  }
}
