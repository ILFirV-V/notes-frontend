import {trigger, style, animate, transition, query, stagger} from '@angular/animations';

export const cardStartAndEndAnimation = trigger('itemAnim', [
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
])

export const listStartAnimation = trigger('listAnim', [
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
