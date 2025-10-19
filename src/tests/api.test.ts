import request from 'supertest';
import { apiServer } from '../api';
import { baseUrl } from '../constants';

jest.mock('uuid', () => ({
  v4: jest
    .fn()
    .mockReturnValueOnce('11111111-1111-1111-1111-111111111111')
    .mockReturnValueOnce('22222222-2222-2222-2222-222222222222')
    .mockReturnValue('33333333-3333-3333-3333-333333333333'),
  validate: jest.fn((id: string) => {
    return id !== 'invalid-uuid' && id.length === 36;
  }),
}));

const bob = { username: 'Bob', age: 30, hobbies: ['coding', 'gaming'] };
const alice = { username: 'Alice', age: 25, hobbies: ['reading'] };

describe('Basic CRUD lifecycle', () => {
  it('should handle complete API lifecycle', async () => {
    const getInitRes = await request(apiServer).get(baseUrl);
    expect(getInitRes.status).toBe(200);
    expect(getInitRes.body).toEqual([]);

    const createRes = await request(apiServer).post(baseUrl).send(bob);
    expect(createRes.status).toBe(201);
    const userId = createRes.body.id;

    const getRes = await request(apiServer).get(`${baseUrl}/${userId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({
      id: userId,
      ...bob,
    });

    const updatedData = {
      username: 'Updated',
      age: 46,
      hobbies: ['testing'],
    };
    const putRes = await request(apiServer)
      .put(`${baseUrl}/${userId}`)
      .send(updatedData);
    expect(putRes.status).toBe(200);
    expect(putRes.body).toEqual({ id: userId, ...updatedData });

    const delRes = await request(apiServer).delete(`${baseUrl}/${userId}`);
    expect(delRes.status).toBe(204);

    const getDeletedRes = await request(apiServer).get(`${baseUrl}/${userId}`);
    expect(getDeletedRes.status).toBe(404);
    expect(getDeletedRes.body.message).toBe('User with this id not found');
  });
});

describe('GET method', () => {
  it('should get correct users after performing POST method', async () => {
    await request(apiServer).post(baseUrl).send(bob);
    await request(apiServer).post(baseUrl).send(alice);
    const users = await request(apiServer).get(baseUrl);

    expect(users.body).toHaveLength(2);
    expect(users.body).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining(bob),
        expect.objectContaining(alice),
      ]),
    );
  });

  it('should return 404 on non-existing id', async () => {
    const res = await request(apiServer).get(
      `${baseUrl}/11111111-1111-1111-1111-111111111111`,
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User with this id not found' });
  });

  it('should return 400 on incorrect schema id', async () => {
    const res = await request(apiServer).get(`${baseUrl}/jigurda`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'No correct UUID provided' });
  });
});

describe('POST method', () => {
  it('should create correct user and return the record', async () => {
    const bobRes = await request(apiServer).post(baseUrl).send(bob);

    expect(bobRes.status).toBe(201);
    expect(bobRes.body).toEqual(expect.objectContaining(bob));
    expect(bobRes.body).toEqual(
      expect.objectContaining({ id: '33333333-3333-3333-3333-333333333333' }),
    );
  });

  it('should not create user when required fields are missing', async () => {
    const bobRes = await request(apiServer).post(baseUrl).send({ name: 'Bob' });

    expect(bobRes.status).toBe(400);
    expect(bobRes.body).toEqual(expect.not.objectContaining(bob));
    expect(bobRes.body).toEqual({
      message: 'User should have username, age and hobbies fields',
    });
  });

  it('should create correct user when extra fields provided', async () => {
    const bobRes = await request(apiServer)
      .post(baseUrl)
      .send({ ...bob, id: '12345', balance: '$1000000' });

    expect(bobRes.status).toBe(201);
    expect(bobRes.body).toEqual(expect.objectContaining(bob));
    expect(bobRes.body).toEqual(expect.not.objectContaining({ id: '12345' }));
    expect(bobRes.body).toEqual(
      expect.not.objectContaining({ balance: '$1000000' }),
    );
  });
});

describe('PUT method', () => {
  it('should update user', async () => {
    const bobRes = await request(apiServer).post(baseUrl).send(bob);
    const userId = bobRes.body.id;
    const putRes = await request(apiServer)
      .put(`${baseUrl}/${userId}`)
      .send(alice);
    expect(putRes.status).toBe(200);
    expect(putRes.body).toEqual({ id: userId, ...alice });
  });

  it('should not update user on incorrect url', async () => {
    const updateRes = await request(apiServer)
      .put(`${baseUrl}/12345`)
      .send(alice);
    expect(updateRes.status).toBe(400);
    expect(updateRes.body).toEqual({ message: 'No correct UUID provided' });
  });

  it('should not update user when required fields are missing', async () => {
    const bobRes = await request(apiServer)
      .post(baseUrl)
      .send({ name: 'Alice' });

    expect(bobRes.status).toBe(400);
    expect(bobRes.body).toEqual({
      message: 'User should have username, age and hobbies fields',
    });
  });
});

describe('DELETE method', () => {
  it('should delete user ', async () => {
    const bobRes = await request(apiServer).post(baseUrl).send(bob);
    const userId = bobRes.body.id;
    const delRes = await request(apiServer).delete(`${baseUrl}/${userId}`);
    expect(delRes.status).toBe(204);
  });

  it('should perform 404 when deleting non-existed user', async () => {
    const delRes = await request(apiServer).delete(
      `${baseUrl}/33333333-3333-3333-3333-333333333333`,
    );
    expect(delRes.status).toBe(404);
  });
});
