import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {
  MagienoBootstrapDropdownComponent
} from '../../../magieno/angular-dropdown/src/lib/magieno-bootstrap-dropdown.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MagienoBootstrapDropdownComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
