import {Injectable} from '@angular/core';
import {Note} from "./note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = new Array<Note>();
  constructor() { }

  getAll(): Note[] {
    return this.notes;
  }

  get(id: number) : Note {
    return this.notes[id];
  }

  getId(note: Note): number {
    return this.notes.indexOf(note);
  }

  update(id: number, editNote: Note): void {
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
}
