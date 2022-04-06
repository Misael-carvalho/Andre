import { LightningElement, api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import clickToCall from '@salesforce/apex/LigarController.clickToCall';

import IS_SPAM from '@salesforce/schema/Account.Span__c';

const CASE_FIELDS = [IS_SPAM];


export default class ConfirmModal extends LightningElement {
    @api recordId;
    @track isSpam;

    @wire(getRecord,{ recordId:'$recordId', fields: CASE_FIELDS })
    getRecord({ error, data }) {
        if(data){
            console.log(data);
            this.isSpam = data.fields.Span__c.value;
        }
        if(error){
            console.log(error);
            this.showToast('Atenção!','Algum problema ocorreu, favor entrar em contato com o Administrador do sistema.','error');
        }
    }
    setCase() {

        clickToCall({ idRef : this.recordId })
        .then(res => {

            this.showToast('Sucesso','Caso marcado como spam.', 'success');
            this.close();
            getRecordNotifyChange([{recordId : this.recordId}]);

        }).catch(err => {

            console.log(err);
            this.showToast('Erro', err.body.message, 'error');
            this.close();

        });

    }

    close() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    handleClick(event){
        
        let finalEvent = {
            originalMessage: this.originalMessage,
            status: event.target.name
        };
        this.dispatchEvent(new CustomEvent('click', {detail: finalEvent}));
    }
}