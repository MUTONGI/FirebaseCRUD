import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AddShoppingPage } from '../add-shopping/add-shopping';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ShoppingItem } from '../../models/shopping-item/shopping-item.interface';
import { EditShoppingItemPage } from '../edit-shopping-item/edit-shopping-item';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  shoppingListRef : AngularFireList<ShoppingItem>;
  shoppingList:  Observable<ShoppingItem[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase, private actionSheetCtrl: ActionSheetController ) {

    this.shoppingListRef= this.database.list('/shopping-list');

    this.shoppingList = this.shoppingListRef.snapshotChanges().map(changes =>{
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  selectShoppingItem(shoppingItem:ShoppingItem){
    this.actionSheetCtrl.create({
      title:`${shoppingItem.itemName}`,
      buttons:[
        {
          text:'Edit',
          handler:() =>{
            this.navCtrl.push(EditShoppingItemPage, {shoppingItemId: shoppingItem.key});
          }
        },
        {
          text:'Delete',
          role:'destructive',
          handler:() =>{
            console.log(shoppingItem);
            this.shoppingListRef.remove(shoppingItem.key);
          }
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:() =>{

          }
        }
      ]
    }).present();
  }

  navigateToAddShoppingPage(){
    this.navCtrl.push(AddShoppingPage);
  }

}
