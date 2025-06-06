import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLoading', () => {
    it('should return an Observable of boolean', (done) => {
      service.getLoading().subscribe(loading => {
        expect(typeof loading).toBe('boolean');
        done();
      });
    });

    it('should initially return false', (done) => {
      service.getLoading().subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });
  });

  describe('setLoading', () => {
    it('should set loading to true when called with true', (done) => {
      service.setLoading('test-url', true);

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should set loading to false when called with false and no other URLs are loading', (done) => {
      service.setLoading('test-url', true);
      service.setLoading('test-url', false);

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should keep loading true if one URL is still loading', (done) => {
      service.setLoading('url1', true);
      service.setLoading('url2', true);
      service.setLoading('url1', false);

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should set loading to false when all URLs are done loading', (done) => {
      service.setLoading('url1', true);
      service.setLoading('url2', true);
      service.setLoading('url1', false);
      service.setLoading('url2', false);

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should do nothing if trying to set loading to false for a URL that is not loading', (done) => {
      service.setLoading('url1', true);
      service.setLoading('url2', false);

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });
  });

  describe('show', () => {
    it('should set loading to true', (done) => {
      service.show();

      service.getLoading().subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should override URL-based loading state', (done) => {
      service.setLoading('url1', true);
      service.setLoading('url1', false);

      service.getLoading().subscribe(loading1 => {
        expect(loading1).toBe(false);

        service.show();
        service.getLoading().subscribe(loading2 => {
          expect(loading2).toBe(true);
          done();
        });
      });
    });
  });
});
