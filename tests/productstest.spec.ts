import{test,expect} from "../fixture/testfixture"
import { ProductPage } from "../pages/ProductsPage"


test.beforeEach(async ({page,dashboardPage}) => {
    await dashboardPage.moduleClick(page,"GK Pages", "Products")
    await expect(page).toHaveURL(/store\/19h577u3p4be\/products/)
})

test('Verify To Create New Product @smoke @sanity @regression', async ({product,page, productPage})=>{
    await productPage.createProduct(product.productname,page)
})

test('Verify Search By Name @sanity @regression', async ({product,page,productPage})=>{
    const exisproduct=await productPage.createProduct(product.productname,page)
    await productPage.searchProductByName(exisproduct)
    await productPage.validateProductInList(page,exisproduct)
})

test('Verify To Delete Product @sanity @regression', async ({page,productPage})=>{
    await productPage.deleteProduct(page)
})

test('Verify To Update Existing Product Name @sanity @regression', async ({page,productPage,product})=>{
    const newname=await productPage.updateExistingProduct(page,product.productname)
    await productPage.searchProductByName(newname)
    await productPage.validateProductInList(page,newname)
})

test('Verify Mandatory Fields @sanity @regression', async({product,page,productPage})=>{
    await productPage.verifyMandatoryValidation(page,product.productname)
})