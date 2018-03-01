/*
 * Copyright (C) 2016 Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.eci.arsw.myrestaurant.restcontrollers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.eci.arsw.myrestaurant.model.Order;
import edu.eci.arsw.myrestaurant.model.ProductType;
import edu.eci.arsw.myrestaurant.model.RestaurantProduct;
import edu.eci.arsw.myrestaurant.services.OrderServicesException;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServices;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServicesStub;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author hcadavid
 */


@Service
@RestController
@RequestMapping(value = "/orders")
public class OrdersAPIController {
    
    @Autowired
    private RestaurantOrderServices rOS;
            
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> manejadorGetRecursoOrdersAPI(){
        try {   
            //obtener datos que se enviarán a través del API
            Set<Integer> set = rOS.getTablesWithOrders();
            Map<Integer,Order> mapOrders = new ConcurrentHashMap<>();
            for(Integer i: set){
                mapOrders.put(i, rOS.getTableOrder(i));
            }
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(mapOrders);
            return new ResponseEntity<>(json,HttpStatus.ACCEPTED);
        } catch (JsonProcessingException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error Creando el Json",HttpStatus.NOT_FOUND);
        }      
    }
    
    @RequestMapping(value="/{idmesa}")
    public ResponseEntity<?> manejadorGetOrder(@PathVariable Integer idmesa){
        try {   
            //obtener datos que se enviarán a través del API
            Map<Integer,Order> mapOrders = new ConcurrentHashMap<>();
            Order o = rOS.getTableOrder(idmesa);
            if (o != null){
                mapOrders.put(idmesa, o);
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writeValueAsString(mapOrders);
                return new ResponseEntity<>(json,HttpStatus.ACCEPTED);
            }
            else{
                return new ResponseEntity<>("La mesa no existe o no tiene una orden asociada",HttpStatus.NOT_FOUND);
            }
            
        } catch (JsonProcessingException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error Creando el Json",HttpStatus.NOT_FOUND);
        }
    
    }
    
    @RequestMapping(method = RequestMethod.POST)	
	public ResponseEntity<?> manejadorPostRecursoOrder(@RequestBody String o){
		try {
                    //registrar dato
                    ObjectMapper mapper = new ObjectMapper();
                    Order newOrder = mapper.readValue(o, Order.class);
                    rOS.addNewOrderToTable(newOrder);
                    return new ResponseEntity<>(HttpStatus.CREATED);
		} catch (IOException ex) {
                    Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
                    return new ResponseEntity<>("Error en entrada",HttpStatus.FORBIDDEN);            
		} catch (OrderServicesException ex) {        
                    Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
        }           return new ResponseEntity<>("Se produjo un error en la orden",HttpStatus.FORBIDDEN);            
    }
     
    @RequestMapping(value="/{idmesa}/total")
    public ResponseEntity<?> manejadorGetOrderTotal(@PathVariable Integer idmesa){
        try {   
            //obtener datos que se enviarán a través del API
            Map<Integer,Order> mapOrders = new ConcurrentHashMap<>();
            int o = rOS.calculateTableBill(idmesa);
                return new ResponseEntity<>(o,HttpStatus.ACCEPTED);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("La mesa no existe o no tiene una orden asociada",HttpStatus.NOT_FOUND);
        }
    
    }
    
    @RequestMapping(value="/{idmesa}", method = RequestMethod.PUT)	
    public ResponseEntity<?> manejadorPutRecursoProduct(@RequestBody String o, @PathVariable Integer idmesa){
            try {
                //registrar dato
                ObjectMapper mapper = new ObjectMapper();
                Map<String,Integer>  newProduct = mapper.readValue(o, ConcurrentHashMap.class);
                Set<String> productos = newProduct.keySet();
                Order orden = rOS.getTableOrder(idmesa);
                for(String i:productos){
                    orden.addDish(i, newProduct.get(i));
                }
                return new ResponseEntity<>(HttpStatus.CREATED);
            } catch (IOException ex) {
                Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
                return new ResponseEntity<>("Error en entrada",HttpStatus.FORBIDDEN);            
            }           
    }
        
    @RequestMapping(method = RequestMethod.DELETE, value="/{idmesa}")
    public ResponseEntity<?> manejadorDeleteRecursoOrder(@PathVariable Integer idmesa){
        try {   
            int o = rOS.calculateTableBill(idmesa);
            rOS.releaseTable(idmesa);
                return new ResponseEntity<>(o,HttpStatus.ACCEPTED);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("La mesa no existe o no tiene una orden asociada",HttpStatus.NOT_FOUND);
        }
    
    }
        
        
    
}