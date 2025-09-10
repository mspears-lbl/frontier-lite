import { Injectable } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Equipment } from '../../models/equipment';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {

    constructor(
        private dbService: DatabaseService
    ) {
    }

    public async getById(equipmentId: string): Promise<Equipment> {
        const results = await this.dbService.getEquipmentById(equipmentId);
        if (results.success && results.data) {
            return results.data;
        }
        else {
            throw new Error('Equipment not found');
        }
    }

}
