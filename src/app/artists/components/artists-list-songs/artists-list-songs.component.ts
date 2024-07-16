import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/songs/components/interfaces/song.interfaces';

@Component({
  selector: 'app-artists-list-songs',
  templateUrl: './artists-list-songs.component.html',
  styleUrls: ['./artists-list-songs.component.scss']
})
export class ArtistListSongsComponent implements OnInit {
  songsList: Song[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Recuperar la lista de canciones del estado de la navegación
    const state = window.history.state;
    if (state && state.songsList) {
      this.songsList = state.songsList;
    }

    console.log('Songs:', this.songsList);
  }
}