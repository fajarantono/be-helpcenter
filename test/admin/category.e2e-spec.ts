import request from 'supertest';
import { APP_URL, TESTER_TOKEN } from '../utils/constants';

describe('Get list of categories by admin (e2e)', () => {
  const app = APP_URL;
  it('Admin FindAll: /api/v1/categories (GET)', () => {
    return request(app)
      .get('/api/v1/categories')
      .auth(TESTER_TOKEN, {
        type: 'bearer',
      })
      .expect(200)
      .send()
      .expect(({ body }) => {
        expect(body.data[0].id).toBeDefined();
        expect(body.data[0].name).toBeDefined();
        expect(body.data[0].slug).toBeDefined();
        expect(body.data[0].icon).toBeDefined();
        expect(body.data[0].published).toBeDefined();
        expect(body.data[0].created_at).toBeDefined();
        expect(body.data[0].updated_at).toBeDefined();
        expect(body.data[0].deleted_at).toBeDefined();
      });
  });
});
