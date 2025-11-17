*** Settings ***
Documentation     Test suite for Sites List functionality
...               Verifies that the sites list page loads correctly
...               and displays all seeded sites from the backend.

Resource          ../config.robot
Resource          ../resources/common_keywords.robot

Suite Setup       Setup Browser For Tests
Suite Teardown    Close Browser    ALL
Test Setup        Navigate To Sites List Page
Test Teardown     Take Screenshot On Failure


*** Test Cases ***
TC01: Sites List Page Loads Successfully
    [Documentation]    Verify that the sites list page loads and displays the header
    [Tags]    smoke    sites-list

    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    Get Text    css=h1    ==    Sites


TC02: All Seeded Sites Are Displayed
    [Documentation]    Verify that all 3 seeded sites are visible in the list
    [Tags]    sites-list    seed-data

    Wait For Elements State    ${SITE_ITEM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Count site items - should be 3 seeded sites
    ${count}=    Get Element Count    ${SITE_ITEM_SELECTOR}
    Should Be Equal As Integers    ${count}    3

    # Verify seeded site names are present
    ${list_text}=    Get Text    ${SITES_LIST_SELECTOR}
    Should Contain    ${list_text}    Desert Alpha
    Should Contain    ${list_text}    Coastal Beta
    Should Contain    ${list_text}    Mountain Gamma


TC03: Each Site Shows Required Information
    [Documentation]    Verify that each site card displays name, location, capacity, and status
    [Tags]    sites-list    data-validation

    Wait For Elements State    ${SITE_ITEM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Check first site (Desert Alpha) has all fields
    ${first_site}=    Get Element    ${SITE_ITEM_SELECTOR} >> nth=0
    Get Text    ${first_site}    contains    Desert Alpha
    Get Text    ${first_site}    contains    Nevada, US
    Get Text    ${first_site}    contains    5000
    Get Text    ${first_site}    contains    ACTIVE


TC04: Add Site Button Is Visible And Enabled
    [Documentation]    Verify that the "Add Site" button is present and clickable
    [Tags]    sites-list    navigation

    Wait For Elements State    ${ADD_SITE_BUTTON}    visible    timeout=${DEFAULT_TIMEOUT}
    Expect Element Enabled    ${ADD_SITE_BUTTON}


TC05: Sites List Is Responsive
    [Documentation]    Verify that the sites list adapts to different viewport sizes
    [Tags]    sites-list    responsive

    # Desktop view
    Set Viewport Size    1920    1080
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Tablet view
    Set Viewport Size    768    1024
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Mobile view
    Set Viewport Size    375    667
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
