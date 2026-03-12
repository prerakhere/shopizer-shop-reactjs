import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
import Layout from '../../layouts/Layout';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { setLoader } from "../../redux/actions/loaderActions";
import { multilanguage } from "redux-multilanguage";
import ReactPaginate from 'react-paginate';

const Shop = ({ isLoading, strings, location, defaultStore, currentLanguageCode, setLoader }) => {
    const [layout, setLayout] = useState('grid three-column');
    const [offset, setOffset] = useState(0);
    const pageLimit = parseInt(window._env_.APP_PRODUCT_GRID_LIMIT) || 12;
    const [productData, setProductData] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const { pathname } = location;

    const getLayout = (layout) => {
        setLayout(layout)
    }

    useEffect(() => {
        getProductList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const getProductList = async () => {
        setLoader(true);
        let action = `${constant.ACTION.PRODUCTS}?store=${defaultStore}&lang=${currentLanguageCode}&page=${offset}&count=${pageLimit}`;
        try {
            let response = await WebService.get(action);
            if (response) {
                setCurrentPage(response.totalPages);
                setProductData(response.products);
                setTotalProduct(response.recordsTotal);
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
        }
    }

    return (
        <Fragment>
            <MetaTags>
                <title>{strings["Shop All"] || "Shop All"}</title>
                <meta name="description" content="Browse all products" />
            </MetaTags>

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>{strings["Home"]}</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{strings["Shop All"] || "Shop All"}</BreadcrumbsItem>

            <Layout headerContainerClass="container-fluid"
                headerPaddingClass="header-padding-2"
                headerTop="visible">
                <Breadcrumb />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        {
                            productData.length > 0 ?
                                (<div className="row">
                                    <div className="col-lg-12">
                                        <ShopTopbar strings={strings} getLayout={getLayout} productCount={totalProduct} offset={offset + 1} pageLimit={pageLimit} sortedProductCount={productData.length} />
                                        <ShopProducts strings={strings} layout={layout} products={productData} />
                                        <div className="pro-pagination-style text-center mt-30">
                                            <ReactPaginate
                                                previousLabel={'«'}
                                                nextLabel={'»'}
                                                breakLabel={'...'}
                                                breakClassName={'break-me'}
                                                pageCount={currentPage}
                                                onPageChange={(e) => setOffset(e.selected)}
                                                containerClassName={'mb-0 mt-0'}
                                                activeClassName={'page-item active'}
                                            />
                                        </div>
                                    </div>
                                </div>)
                                :
                                (
                                    !isLoading && <div className="col-lg-12">
                                        <div className="item-empty-area text-center">
                                            <div className="item-empty-area__icon mb-30">
                                                <i className="pe-7s-shopbag"></i>
                                            </div>
                                            <div className="item-empty-area__text">
                                                {strings["No items found"] || "No items found"}<br />{" "}
                                            </div>
                                        </div>
                                    </div>)
                        }
                    </div>
                </div>
            </Layout>
        </Fragment>
    )
}

Shop.propTypes = {
    location: PropTypes.object
}

const mapStateToProps = state => {
    return {
        currentLanguageCode: state.multilanguage.currentLanguageCode,
        defaultStore: state.merchantData.defaultStore,
        isLoading: state.loading.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLoader: (value) => {
            dispatch(setLoader(value));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(Shop));
