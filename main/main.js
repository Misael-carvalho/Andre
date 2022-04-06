import { LightningElement, api, track } from 'lwc';
import clickToCall from '@salesforce/apex/LigarController.desmarcar';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';



//https://developer.salesforce.com/docs/component-library/bundle/lightning-platform-show-toast-event/documentation

export default class Main extends LightningElement {
    @api recordId;
    @track isDialogVisible = false;
    @track originalMessage;

    handleClick(event){
        if(event.target.name === 'openConfirmation'){
            this.originalMessage = 'test message';
            this.isDialogVisible = true;
        }else if(event.target.name === 'confirmModal'){

            if(event.detail !== 1){
                this.displayMessage = 'Status: ' + event.detail.status + '. Event detail: ' + JSON.stringify(event.detail.originalMessage) + '.';

                if(event.detail.status === 'confirm') {

                    clickToCall({ idRef: this.recordId})
                            .then(result => {
                                console.log(result);
                                this.showToast('success','Sucesso', 'Ligação solicitada com sucesso');
                                this.close();
                                getRecordNotifyChange([{recordId : this.recordId}]);

                            })
                            .catch(error => {
                                this.showToast('error', 'Falhou', error.body.message);
                                this.close();
                            });
                }

                else if(event.detail.status === 'cancel'){
                }
            }

            this.isDialogVisible = false;
        }
    }
    close() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
        
    showToast(variant, title, message){

        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });

        this.dispatchEvent(evt);

    }
    

}