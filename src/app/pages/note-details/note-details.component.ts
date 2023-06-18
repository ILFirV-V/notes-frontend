import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Note} from "../../interfaces/note.model";
import {NotesService} from "../../services/notes.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  constructor(private noteService: NotesService,
              private router: Router,
              private route: ActivatedRoute) { }

  note: Note = {
    title: "",
    body: "",
  };

  noteId: number = -1;
  new: boolean = true;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if(params && params['id']) {
        this.noteId = params['id'];
        this.note = this.noteService.get(this.noteId)
        this.new = false;
      } else {
        this.new = true;
      }
    })
  }

  onSubmit(form: NgForm) {
    if(this.new) {
      this.noteService.add(form.value);
    } else {
      this.noteService.update(this.noteId, form.value)
    }
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
