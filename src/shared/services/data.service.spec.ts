import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [DataService]
  }));

  it(`should create`, async(inject([HttpTestingController, DataService],
    (httpClient: HttpTestingController, dataService: DataService) => {
      expect(dataService).toBeTruthy();
    })));

  it('should upload and get data', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });
});
