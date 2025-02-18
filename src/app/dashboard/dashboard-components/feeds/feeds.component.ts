import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../service/history.service';
import { Feed } from './feeds-data';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html'
})
export class FeedsComponent implements OnInit {

  //Crear un array de feeds
  feeds: Feed[] = [];

  constructor(private historyService: HistoryService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.historyService.getAllEntitiesByDate(today).subscribe(dataArray => {
      const types: string[] = ['Artist', 'Song', 'Album', 'Genre'];
      const typeIcons: { [key: string]: string } = {
        'Artist': 'bi bi-person',
        'Song': 'bi bi-music-note',
        'Album': 'bi bi-music-note-list',
        'Genre': 'bi bi-bookmark'
      };

      types.forEach((type, index) => {
        const entitiesLastMonth = dataArray[index].filter((entity: { timestamp: string }) => {
          const entityDate = new Date(entity.timestamp);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return entityDate > lastMonth;
        });

        if (entitiesLastMonth.length > 0) {

          const newFeed: Feed = {
            class: 'bg-primary',
            icon: typeIcons[type],
            task: `${entitiesLastMonth.length}`,
            entity: `${type === 'Song' ? 'CANCIONES_L' : type === 'Album' ? 'ALBUMES_L' : type === 'Genre' ? 'GENEROS_L' : 'ARTISTAS_L'}`,
            time: ''
          };
          this.feeds.unshift(newFeed); // Añadir el nuevo feed al principio de la lista
        }
      });
    });
  }

}
