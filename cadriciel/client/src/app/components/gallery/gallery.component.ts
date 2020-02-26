import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent  implements OnInit  {

  galleryForm: FormGroup;
  width: number;
  height: number;

  constructor(private formBuilder: FormBuilder,
              private winService: ModalWindowService,
              private router: Router) {

  }

  ngOnInit() {
    this.initForm();
    window.alert('allo');

  }

  initForm() {
    this.galleryForm = this.formBuilder.group({      
    });

  }

  onSubmit() {
    this.closeModalForm();
    this.router.navigate(['/vue']);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 15); // waits for the canvas to be created
  }

  closeModalForm() {
    this.winService.closeWindow();
  }

}