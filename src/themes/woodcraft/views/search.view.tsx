/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { ISearchData, ISearchFormViewProps, ISearchViewProps } from '@msdyn365-commerce-modules/search';
import { Button, format, isMobile, Module, Node, VariantType } from '@msdyn365-commerce-modules/utilities';
import React, { useCallback, useEffect, useState } from 'react';

import { ISearchProps } from '../definition-extensions/search.ext.props.autogenerated';
import { CategorySuggestionsComponent } from './components/search.categorysuggest';
import { FormComponent } from './components/search.form';
import { KeywordSuggestionsComponent } from './components/search.keywordsuggest';
import { ProductSuggestionsComponent } from './components/search.productsuggest';

/**
 * Render Title for AutoSuggest.
 * @param searchSuggestionHeading -The heading resource string.
 * @param searchText -The search string.
 * @returns -The JSX Element.
 */
const renderTitle = (searchSuggestionHeading: string, searchText: string): JSX.Element => {
    const searchTextString = '"'.concat(searchText.concat('"'));
    const searchAutoSuggestionHeading = searchSuggestionHeading ? format(searchSuggestionHeading, searchTextString) : `Search for ${searchTextString}`;

    return (
        <Node className='msc-autoSuggest__search-title'>
            {searchAutoSuggestionHeading}
        </Node>
    );
};

/**
 * Search View.
 * @param props - The view props.
 * @returns The JSX Element.
 */
const SearchView: React.FC<ISearchViewProps & ISearchProps<ISearchData>> = (props: ISearchViewProps & ISearchProps<ISearchData>): JSX.Element => {
    const {
        Search,
        AutoSuggestAriaLabel,
        AutoSuggestAriaLabelText,
        searchText,
        AutoSuggest,
        KeywordSuggest,
        ProductSuggest,
        UlKeyword,
        UlProduct,
        form,
        autosuggestKeyword,
        autosuggestProduct,
        SearchForm,
        FormWrapper,
        label,
        context,
        isLoadingAutoSuggest,
        isLoadingNode
    } = props;

    const { searchSuggestionHeading, categorySuggestionHeading, keywordsHeading, noResultText, clearSearchButtonText } = props.resources;

    const [searchTextString, setSearchTextString] = useState<string>();
    const [isMobilePort, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        setSearchTextString(searchText);
    }, [searchText]);

    /**
     * ClearSearch callback method to clear search string.
     */
    const clearSearch = (): void => {
        setSearchTextString('');

        const propsForm = props.form as ISearchFormViewProps;
        const propsFormInput = propsForm.input as React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        const propsFormInputCurrent = (propsFormInput.ref as React.RefObject<HTMLInputElement>).current;

        if (propsFormInputCurrent) {
            propsFormInputCurrent.value = '';
        }

        propsFormInput.value = '';
        props.searchText = '';
        props.FormWrapper.action = '';
    };

    const isMobileViewport = useCallback(() => {
        const isMobileView = isMobile({ variant: VariantType.Browser, context: context.request }) === 'xs';
        setIsMobile(isMobileView);
    }, [context]);

    useEffect(() => {
        window.addEventListener('resize', isMobileViewport);
        isMobileViewport();
    }, [isMobileViewport]);

    const viewport = isMobile({ variant: VariantType.Browser, context: context.request });

    const isMobileView = (viewport === 'sm' || viewport === 'xs');

    AutoSuggest.className = !StringExtensions.isNullOrEmpty(searchTextString) ? `${AutoSuggest.className} show` : `${AutoSuggest.className} hide`;
    const isSearchText: boolean = !StringExtensions.isNullOrEmpty(searchTextString);

    return (
        <Module {...Search}>
            {label}
            {FormComponent(form as ISearchFormViewProps, SearchForm, FormWrapper, isMobilePort, clearSearchButtonText, props, isSearchText, clearSearch)}
            { !isMobileView && <Node {...AutoSuggest}>
                {!StringExtensions.isNullOrEmpty(searchTextString) ? <Node
                    {...AutoSuggestAriaLabel}
                >
                    {AutoSuggestAriaLabelText}
                </Node> : ''}
                {!StringExtensions.isNullOrEmpty(searchTextString) ? (
                    <>
                        <Node className='msc-autoSuggest__search-title-container'>
                            <Button
                                className='ms-search__form-cancelSearch'
                                aria-label={props.resources.cancelBtnAriaLabel}
                                onClick={clearSearch}
                                type='button'
                            />
                            {renderTitle(searchSuggestionHeading, searchText)}
                        </Node>
                        <Node className='msc-autoSuggest__results-container'>
                            <Node className='msc-autoSuggest__results'>
                                {CategorySuggestionsComponent(categorySuggestionHeading, noResultText,
                                    props, isLoadingAutoSuggest, isLoadingNode)}
                                {KeywordSuggestionsComponent(KeywordSuggest, UlKeyword, keywordsHeading, noResultText, autosuggestKeyword,
                                    isLoadingAutoSuggest, isLoadingNode)}
                            </Node>
                            {ProductSuggestionsComponent(ProductSuggest, UlProduct, props, autosuggestProduct,
                                isLoadingAutoSuggest, isLoadingNode)}
                        </Node>
                    </>
                ) : null}
            </Node>}
            { isMobileView && props.isSearchFormExpanded && <Node {...AutoSuggest}>
                {!StringExtensions.isNullOrEmpty(searchTextString) ? <Node
                    {...AutoSuggestAriaLabel}
                >
                    {AutoSuggestAriaLabelText}
                </Node> : ''}
                {!StringExtensions.isNullOrEmpty(searchTextString) ? (
                    <>
                        <Node className='msc-autoSuggest__search-title-container'>
                            {(form as ISearchFormViewProps).cancelBtn}
                            {renderTitle(searchSuggestionHeading, searchText)}
                        </Node>
                        <Node className='msc-autoSuggest__results-container'>
                            <Node className='msc-autoSuggest__results'>
                                {CategorySuggestionsComponent(categorySuggestionHeading, noResultText,
                                    props, isLoadingAutoSuggest, isLoadingNode)}
                                {KeywordSuggestionsComponent(KeywordSuggest, UlKeyword, keywordsHeading, noResultText, autosuggestKeyword,
                                    isLoadingAutoSuggest, isLoadingNode)}
                            </Node>
                            {ProductSuggestionsComponent(ProductSuggest, UlProduct, props, autosuggestProduct,
                                isLoadingAutoSuggest, isLoadingNode)}
                        </Node>
                    </>
                ) : null}
            </Node>}
        </Module>
    );
};
export default SearchView;
