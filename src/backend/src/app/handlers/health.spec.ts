import 'jasmine';
import * as httpMocks from 'node-mocks-http';
import * as underTest from './health.handler';
import { NextFunction } from 'express';
import { HttpStatusCode } from '../../../../common/models/http-status-codes';
import { AppDatabaseError } from '../../../../common/models/errors';
import { db } from '../../db';

describe('Health check', () => {
    let request: any;
    let response: any;
    let next: NextFunction;

    beforeEach(() => {
        // create new mocked request/response objects for each test
        request = httpMocks.createRequest({});
        response = httpMocks.createResponse();
        next = jasmine.createSpy('next');
    });

	it('should send a 200 response code', async () => {
		spyOn(db, 'query')
			.and
			.returnValue(
				Promise.resolve({healthy: 1})
			);
		spyOn(response, 'send');
		await underTest.healthCheckHandler(request, response,  next);
		expect(db.query).toHaveBeenCalledTimes(1);
		expect(response.send).toHaveBeenCalledWith({healthy: true});
	});

	it('Should throw an AppDatabaseError', async () => {
        spyOn(response, 'send');
		spyOn(db, 'query')
			.and
			.returnValue(
                Promise.reject(new AppDatabaseError('Error evaluating health'))
			);
		await underTest.healthCheckHandler(request, response, next);
        expect(next).toHaveBeenCalledWith(jasmine.any(AppDatabaseError));
		expect(db.query).toHaveBeenCalledTimes(1);
		expect(response.send).not.toHaveBeenCalled();
	});

});
