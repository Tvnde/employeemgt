@extends('layouts.sales')

@section('content')
    <div class="col-md-12">

        <div class="panel panel-primary" data-collapsed="0">

            <div class="panel-heading">
                <div class="panel-title">
             Discount
                </div>
            </div>


                <form  class="form-horizontal form-groups" action="/sales/edit-client" method="post">
                    <div class="panel-body">



                    <div class="form-group">
                        <label class="col-sm-3 control-label">Client</label>

                        <div class="col-sm-5">
                            <select class="form-control" id="client_id"  name="client" required>
                                <option value="0">
                                    Select Client
                                </option>
                                @foreach($client as $clients)
                                <option value="{{$clients->id}}">
                                    {{$clients->name}}
                                </option>
                                @endforeach
                                </select>

                        </div>
                    </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">VAT</label>

                            <div class="col-sm-5">
                                <select class="form-control" id="vat"  name="vat" required>
                                    <option value="0">
                                        No
                                    </option>
                                    <option value="1">
                                        Yes
                                    </option>
                                </select>

                            </div>
                        </div>

                    


                    <div class="form-group">
                        <label for="field-1" class="col-sm-3 control-label">Discount</label>

                        <div class="col-sm-5">
                            <input type="number" min="0" max="100" class="form-control" id="discount" value="0" name="discount" placeholder="Discount(%)" required>
                        </div>
                    </div>


                </div>
                    {{--<div class="panel-body">--}}
                    {{--<div class="form-inline">--}}
                        {{--<label class="col-sm-3 control-label">Client</label>--}}

                        {{--<div class="col-sm-5">--}}
                            {{--<select class="form-control"  name="products" required>--}}
                                {{--@foreach($product as $products)--}}
                                    {{--<option value="{{$products->id}}">--}}
                                        {{--{{$products->product_name}}{{'  '}}{{$products->selling_price}}--}}
                                    {{--</option>--}}

                                {{--@endforeach--}}

                            {{--</select>--}}
                            {{--<input type="number" class="form-control"  name="quantity" placeholder="quantity">--}}
{{--<button class="btn btn-primary">Add</button>--}}
                        {{--</div>--}}
                    {{--</div>--}}
                    {{--</div>--}}
                </form>

        </div>
            <div class="col-md-12">
                {{--<script type="text/javascript">--}}
                    {{--jQuery( document ).ready( function( $ ) {--}}
                        {{--var $table1 = jQuery( '#table-1' );--}}
                        {{--var $table2 = jQuery( '#table-2' );--}}
                        {{--var $table3 = jQuery( '#table-3' );--}}
                        {{--// Initialize DataTable--}}
                        {{--$table1.DataTable( {--}}
                            {{--"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],--}}
                            {{--"bStateSave": true--}}
                        {{--});--}}
                        {{--$table2.DataTable( {--}}
                            {{--"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],--}}
                            {{--"bStateSave": true--}}
                        {{--});--}}
                        {{--$table3.DataTable( {--}}
                            {{--"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],--}}
                            {{--"bStateSave": true--}}
                        {{--});--}}

                        {{--// Initalize Select Dropdown after DataTables is created--}}
                        {{--$table1.closest( '.dataTables_wrapper' ).find( 'select' ).select2( {--}}
                            {{--minimumResultsForSearch: -1--}}

                        {{--});--}}
                        {{--$table2.closest( '.dataTables_wrapper' ).find( 'select' ).select2( {--}}
                            {{--minimumResultsForSearch: -1--}}

                        {{--});--}}
                        {{--$table3.closest( '.dataTables_wrapper' ).find( 'select' ).select2( {--}}
                            {{--minimumResultsForSearch: -1--}}

                        {{--});--}}
                    {{--} );--}}
                {{--</script>--}}
                <div class="panel panel-primary">
                    <div class="panel-heading">

                        <div class="panel-title">
                            <h3>
                                New Product Sale
                            </h3>
                        </div>
                        <div class="panel-options">
                            <a href="#sample-modal" data-toggle="modal" data-target="#sample-modal-dialog-1" class="bg"><i class="entypo-cog"></i></a>
                            <a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
                            <a href="#" data-rel="reload"><i class="entypo-arrows-ccw"></i></a>

                        </div>

                    </div>

                    <div class="panel-body with-table">

                        <table class="table table-bordered " id="table-2">
                            <thead>
                            <tr>

                                <th >Product</th>
                                <th >Quantity</th>
                                <th >Price</th>

                                <th >Action</th>

                            </tr>
                            </thead>
                            <tbody id="items">


                            </tbody>
                            <tfoot>
                            <tr>
                                <td></td>
                                <td><span id="totalQty"></span></td>
                                <td class="text-right"><strong><span id="totalAmount"></span></strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class="text-right">
                                    <button id="addNewItem" class="btn btn-primary"   title="Add New Item"><i class="entypo-plus"></i></button>
                                    <button type="button" class="submit btn btn-success" id="submitForm" data-toggle="tooltip" data-placement="top" title="Submit Form"><i class="entypo-basket"></i></button>
                              
                                </td>
                            </tr>

                            </tfoot>

                        </table>
                    </div>
                </div>
            </div>


            </div>

        </div>

    </div>

    <script src="{{ asset('assets/js/jquery-3.2.1.js')}}"></script>
    <script type="text/javascript">

            var counter = 0;
            var products = '';
            var itemInTable = [];


            getProducts();


            function getProducts() {

                if (products == '') {
                    $.ajax({
                        type: "GET",
                        url: "{!! URL::route('sales/getProducts') !!}",
                        dataType: 'json',
                        success: function (data) {
                            products = data;
                        }
                    });
                }

                return false;
            }
            function calculateQuantity() {
                var allVals = 0;
                $('[id^="input_quantity"]').each(function() {
                    var quantity = $(this).text();
                    if(!parseInt(quantity)){
                        quantity = 0.0;
                    }
                    allVals += parseInt(quantity);
                });
                // $('#totalQty').text(allVals);
            }
            function calculateTotal() {


                var allVals = 0.0;

                var discount = $("#discount").val();
                $('[id^="item_price"]').each(function() {
                    var price = $(this).text();
                    if(!parseFloat(price)){
                        price = 0.0;
                    }

                    allVals += parseFloat(price);


                });
                allVals = allVals - (allVals * discount/100);
                $('#totalAmount').text(allVals);
                return allVals;
            }


            $("#submitForm").click(function (e) {
                calculateTotal();
                //Get All items
                var items = [];
                var qty = [];
                var discount = $("#discount").val();
                var vat = $("#vat").val();
                var client_id =  $("#client_id").val();

                $('[id^="item_id"]').each(function() {
                    var item = $(this).val();
                    if(item == 0){
                        return false;
                    }

                    items.push(item);
                });

                $('[id^="input_quantity"]').each(function() {
                    var quanty = $(this).val();
//                    if(quanty == 0){
//                        alert('Select A Product');
//                        return false;
//                    }

                    qty.push(quanty);
                });

                if(items.length == 0){
                    swal('Error', 'Select A Product', 'info' );

                    return false;
                }


                if(client_id == 0){
                    swal('Error', 'Please select a client', 'info' );
                    return false;
                }

                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        type: "POST",
                        url:"{!!URL::route('sales/order')!!}",
                        type: 'post',
                        data:
                            {
                                client_id: client_id,
                                items:items,
                                qty:qty,
                                discount:discount,
                                vat: vat
                            },
                        dataType: 'text',
                        beforeSend: function() {
                            $('.submit').html('<i class="entypo-spinner entypo-spin entypo-1x entypo-fw"></i>');
                        },
                        complete: function() {
                            $('.submit').html('<i class="entypo-basket"></i>');
                        },
                        success: function(data) {
                            swal('Order Placed', 'Proceed to payment','success');
                            window.location.replace('/sales/products/new-sales')
                        },
                        error: function(xhr, ajaxOptions, thrownError) {
                            swal('Error', thrownError, 'error' );
//                            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                        }
                    });


            });
            $("#addNewItem").click(function (e) {
                {
                    {
                        counter++;

                        var prods = '<select name="product_id[]" id="item_id' + counter + '" class="form-control" required " onchange="getProductPrice('+counter+')"><option value="0">---SELECT PRODUCT---</option>';
                        $.each( products, function( key, value ) {
                            if(value['quantity'] > 0) {
                                prods += '<option value="' + value["id"] + '">' + value["product_name"] + '</option>';
                            }
                            else{
                                prods += '<option value="' + value["id"] + '" disabled style="color:red">' + value["product_name"] +": "+ "Not Available" +'</option>';
                            }
                        });

                        prods += '</select>';

                        var html = '<tr id="item' + counter + '"><td>' + prods + '</td><td><input type="number" name="quantity[]" id="input_quantity' + counter + '" class="form-control" onkeyup="updateAmount(' + counter + ')"  onkeydown="updateAmount(' + counter + ')"onchange="updateAmount(' + counter + ')" value="1" min="1" required="required" title=""> <span id="input_quantity_status' + counter + '"></span></td> <td class="text-right"><span id="item_price' + counter + '">0</span><span style="visibility: hidden;" id="product_id' + counter + '">0</span></td><td><button type="button" onclick="removeItem(' + counter + ')" class="btn btn-sm btn-danger pull-right"><i class="entypo-trash"></i></button></td></tr>';

                        $(html).appendTo("#items");
                    }
                }

return false;
            });
            function removeItem(id) {
                var product_id = $('#product_id'+id).text();

                var index = $.inArray(product_id, itemInTable);
                itemInTable.splice(index, 1);
                $("#addNewItem").prop('disabled', false);
                $("#submitForm").prop('disabled', false);

                console.log(itemInTable);

                $('#item'+id).remove();
                calculateQuantity();
                calculateTotal();
            }
            function updateAmount(id) {

                var quantity = $("#input_quantity"+id).val();

                var tmp = "item_id"+id;
                var e = document.getElementById(tmp);
                var strUser = e.options[e.selectedIndex].value;

                $.each( products, function( key, value ) {

                    if(value["id"] == strUser){
                        if(value["quantity"] < quantity){
                            $("#input_quantity_status"+id).text("Reduce Quantity").css('color','#dc3545');
                            $("#addNewItem").prop('disabled', true);
                            $("#submitForm").prop('disabled', true);
                        }
                        else if(value["quantity"] >= quantity){
                            $("#input_quantity_status"+id).text("Product Available").css('color','#28a745');
                            $("#addNewItem").prop('disabled', false);
                            $("#submitForm").prop('disabled', false);
                        }
//                    else if(value["quantity"] == value["stock_limit"]){
//                        $("#input_quantity_status"+id).text("Product Low in Quantity");
//                    }
                        var price_id = "item_price" + id;
                        $('#'+price_id).text(value["selling_price"] * quantity);
                    }
                });
                calculateQuantity();
                calculateTotal();
            }


            function getProductPrice(id) {
                var quantity = $("#input_quantity"+id).val();
                var tmp = "item_id"+id;
                var e = document.getElementById(tmp);
                var strUser = e.options[e.selectedIndex].value;

                $.each( products, function( key, value ) {

                    if (value["id"] == strUser) {

                        if ($.inArray(value["id"], itemInTable) == -1) {

                            var price_id = "item_price" + id;
                            $('#' + price_id).text(value["selling_price"]);

                            $('#product_id' + id).text(value["id"]);
                            if(value["quantity"] < quantity){
                                $("#input_quantity_status"+id).text("Reduce Quantity").css('color','#dc3545');
                                $("#addNewItem").prop('disabled', true);
                                $("#submitForm").prop('disabled', true);
                            }
                            else if(value["quantity"] >= quantity){
                                $("#input_quantity_status"+id).text("Product Available").css('color','#28a745');
                                $("#addNewItem").prop('disabled', false);
                                $("#submitForm").prop('disabled', false);
                            }
//                    else if(value["quantity
                            // Store Product ID in itemInTable to check for duplicate products
                            itemInTable.push(value["id"]);
                            console.log(itemInTable);

                        } else {
                            // Not There, Delete Row
                            removeItem(id);
                            return;
                            // $('#item'+id).remove();
                        }

                        // Calc Total and QUantity
                        calculateQuantity();
                        calculateTotal();
                    }
                    });







            }
    </script>

@endsection

