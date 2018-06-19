import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ceki-trash-overview',
  templateUrl: './trash-overview.component.html',
  styleUrls: ['./trash-overview.component.scss']
})
export class TrashOverviewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TrashOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
