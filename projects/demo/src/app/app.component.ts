import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {
  AngularBootstrapDropdownComponent
} from '../../../magieno/angular-dropdown/src/lib/angular-bootstrap-dropdown.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularBootstrapDropdownComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
