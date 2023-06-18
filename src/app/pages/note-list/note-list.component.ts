import { Component, OnInit } from '@angular/core';
import { Note } from "../../interfaces/note.model";
import { NotesService } from "../../services/notes.service";
import { cardStartAndEndAnimation, listStartAnimation } from "../../animations/animations";

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  animations: [
    cardStartAndEndAnimation,
    listStartAnimation,
  ]
})
export class NoteListComponent implements OnInit{
  notes: Note[] = new Array<Note>();
  filterValue: string = "";

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    this.notes = this.notesService.getAll();
  }

  deleteNote(note: Note) {
    let nodeId = this.notesService.getId(note);
    this.notesService.delete(nodeId);
    this.filter();
  }

  filter(filterQuery?: string) {
    let query: string = this.filterValue;
    if(filterQuery) {
      query = filterQuery;
    }
    this.notes = this.notesService.filter(query);
  }

  generateNoteUrl(note: Note): string {
    let nodeId = this.notesService.getId(note)
    return nodeId.toString();
  }
}
