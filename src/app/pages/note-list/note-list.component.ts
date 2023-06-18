import {Component, OnInit} from '@angular/core';
import {Note} from "../../shared/note.model";
import {NotesService} from "../../shared/notes.service";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      //ENTRY ANIMATION
      transition('void  => *', [
        // Initial stale
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          //we have to 'expend' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // we first want to animate the spacing (which includes height and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*',
        })),
        animate(120)
      ]),

      transition('* => void', [
        // first scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        //then scale down while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        //scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        // then animate the spacing (while includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }))
      ])
    ]),

    trigger('listAnim', [
      transition(('* => *'), [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true,
        })
      ])
    ])
  ]
})
export class NoteListComponent implements OnInit{
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  filterValue: string = "";


  constructor(private notesService: NotesService) { }

  ngOnInit() {
    this.notes = this.notesService.getAll();
    this.filter();
  }

  deleteNote(note: Note) {
    let nodeId = this.notesService.getId(note);
    this.notesService.delete(nodeId);
    this.filter();
  }

  filter(filterQuery?: string) {
    let query: string = this.filterValue.toLowerCase().trim();
    if(filterQuery) {
      query = filterQuery.toLowerCase().trim();
    }
    let allResults: Note[] = new Array<Note>();
    //split up the search query into individual words
    let terms: string[] = query.split(' '); //split on spaces
    //remove duplicate search terms
    terms = this.removeDuplicates(terms);
    //compile all relevant result into the allResults array
    terms.forEach(term => {
      let result: Note[] = this.relevantNote(term);
      //append results to the allResults array
      allResults = [...allResults, ...result];
    })

    //allResult will include duplicate notes
    //became a particular note can be the result of many search terms
    //but we don't want to show the same note multiple times on the UI
    //so we first must remove the duplicates
    this.filteredNotes = this.removeDuplicates(allResults);

    //now sort by relevancy
    this.sortByRelevancy(allResults)
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResult: Set<any> = new Set<any>();
    //loop through the input array and add the items to the set
    arr.forEach(e => uniqueResult.add(e));
    return Array.from(uniqueResult);
  }

  relevantNote(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    return this.notes.filter(note =>
      note.body.toLowerCase().includes(query) || note.title.toLowerCase().includes(query));
  }

  sortByRelevancy(searchResult: Note[]) {
    //this method will calculate the relevancy of a note based on the number of times is appears in the search results
    let noteCountObject: IndexedObject = {}; // format - key: value => NoteId: number (note object id: count)

    searchResult.forEach(note => {
      let noteId = this.notesService.getId(note); //get the notes Id

      if(noteCountObject[noteId]) {
        noteCountObject[noteId] += 1;
      } else {
        noteCountObject[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((firstNote: Note, secondNote: Note) => {
      let firstNoteId = this.notesService.getId(firstNote);
      let secondNoteId = this.notesService.getId(secondNote);

      let firstNoteCount = noteCountObject[firstNoteId];
      let secondNoteCount = noteCountObject[secondNoteId];
      return secondNoteCount - firstNoteCount;
    })
  }
  generateNoteUrl(note: Note): string {
    let nodeId = this.notesService.getId(note)
    return nodeId.toString();
  }
}

interface IndexedObject {
  [key: number]: number;
  [key: string]: number;
}
