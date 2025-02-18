import { Component, Input, OnInit } from '@angular/core';
import { AlbumService } from '../../services/albums.service';
import { Album } from '../interfaces/album.interfaces';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs';
import { HistoryService } from 'src/app/dashboard/service/history.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'src/app/shared/ErrorHandlerService';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  @Input()
  public albumsList: Album[] = [];
  public albumToDelete: Album | null = null;
  public sortColumn: keyof Album = 'title';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public currentPage: number = 1;
  public itemsPerPage: number = 2;
  public itemsPerPageOptions: number[] = [2, 10, 20, 50];
  public collectionSize: number = 0;
  public errorMessage: string = '';
  public filters: any = {
    title: '',
    description: '',
    year: '',
    url: '',
    artist_id: ''
  };
  public showModal : boolean = false;
  public placeholderName: string = "";
  public placeholderAge: string = "";
  public placeholderCountry: string   = "";
  public placeholderDateOfBirth: string = "";
  public placeholderTitle: string   = "";
  public placeholderDescription: string = "";
  public placeholderYear: string = "";
  public placeholderUrl: string  = "";
  public placeholderArtistId: string = "";


  constructor(private albumService: AlbumService,
    private router: Router,
    private historyService : HistoryService,
    private translate : TranslateService,
    private errorHandler : ErrorHandlerService) { }

  ngOnInit(): void {
    this.errorHandler.checkRole('ROLE_USER');
    this.translate.get(['FILTRAR_POR', 'NOMBRE', 'EDAD', 'PAIS', 'FECHA_DE_NACIMIENTO', 'TITULO', 'DESCRIPCION', 'AÑO', 'URL', 'ARTISTA_ID'])
    .subscribe(translations => {
      this.placeholderName = `${translations['FILTRAR_POR']} ${translations['NOMBRE']}`;
      this.placeholderAge = `${translations['FILTRAR_POR']} ${translations['EDAD']}`;
      this.placeholderCountry = `${translations['FILTRAR_POR']} ${translations['PAIS']}`;
      this.placeholderDateOfBirth = `${translations['FILTRAR_POR']} ${translations['FECHA_DE_NACIMIENTO']}`;
      this.placeholderTitle = `${translations['FILTRAR_POR']} ${translations['TITULO']}`;
      this.placeholderDescription = `${translations['FILTRAR_POR']} ${translations['DESCRIPCION']}`;
      this.placeholderYear = `${translations['FILTRAR_POR']} ${translations['AÑO']}`;
      this.placeholderUrl = `${translations['FILTRAR_POR']} ${translations['URL']}`;
      this.placeholderArtistId = `${translations['FILTRAR_POR']} ${translations['ARTISTA_ID']}`;
    });
    this.historyService.getCounts().subscribe(
      (data) => {
        this.collectionSize = data.albums;
        console.log('Albums:', this.collectionSize);
      },
      (error) => {
        console.error('Error fetching history:', error);
      }
    );
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albumService.getAlbums(this.currentPage - 1, this.itemsPerPage, this.sortColumn, this.sortDirection, this.filters)
      .subscribe(
        (data) => {
          this.albumsList = data;
          this.sortAlbums(); // Ordenar después de recibir los datos
          console.log('Albums:', this.albumsList);
          if (this.albumsList.length === 0) {
            this.errorMessage = 'No albums found';
            console.error('No albums found');
          }
        },
        (error) => {
          console.error('Error fetching albums:', error);
        }
      );
  }

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  sortAlbums(): void {
    this.albumsList.sort((a, b) => {
      const aValue = this.getProperty(a, this.sortColumn) ?? '';
      const bValue = this.getProperty(b, this.sortColumn) ?? '';

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  setSortColumn(column: keyof Album): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadAlbums();
  }

  nextPage(): void {
    this.currentPage++;
    this.albumsList = [];
    this.loadAlbums();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.albumsList = [];
      this.loadAlbums();
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.albumsList = [];
    this.errorMessage = '';
    this.loadAlbums();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      description: '',
      year: '',
      url: '',
      artist_id: ''
    };
    this.errorMessage = '';
    this.applyFilters();
  }

  navigateToSongs(album: Album): void {
    console.log('Navigating to songs:', album.title);
    this.router.navigate(['/albums/albums-list-songs'], { state: { album: album.title } });
  }

  openDeleteModal(album: Album) {
    this.albumToDelete = album;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.albumToDelete = null;
  }

  confirmDelete() {
    // Lógica para eliminar al artista
    if (this.albumToDelete) {
      // Elimina al artista de la lista (o realiza una llamada a un servicio para eliminarlo)
      this.albumService.deleteAlbum(this.albumToDelete.id.toString()).subscribe(
        (response) => {
          console.log('Artist deleted successfully:', response);
          this.albumToDelete = null;
          this.closeDeleteModal();
          this.loadAlbums();
        },
        (error) => {
          console.error('Error deleting artist:', error);
          this.albumToDelete = null;
          this.closeDeleteModal();
        }
      );
      this.albumToDelete = null;
      this.closeDeleteModal();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Resetear a la primera página cuando cambie el número de ítems por página
    this.loadAlbums();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAlbums();
  }


}
