import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {Sidebar} from "../../shared/components/sidebar/sidebar";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout.html',
  styles: ``
})
export class Layout {

}
