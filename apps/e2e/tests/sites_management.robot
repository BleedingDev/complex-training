*** Settings ***
Documentation     Comprehensive site management tests
...               Tests for listing, creating, and validating sites.

Resource          ../config.robot
Resource          ../resources/common_keywords.robot

Suite Setup       Setup Browser For Tests
Suite Teardown    Close Browser    ALL
Test Setup        Go To Sites Page
Test Teardown     Take Screenshot On Failure

*** Test Cases ***
List Shows Seeded Sites
    [Documentation]    Verify that seeded sites are displayed in the list
    [Tags]    smoke    sites-list

    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${count}=    Get Element Count    ${SITE_ITEM_SELECTOR}
    Should Be True    ${count} >= 1
    ...    msg=Expected at least 1 seeded site but found ${count}


Create Site Appears In List
    [Documentation]    Verify that a newly created site appears in the sites list
    [Tags]    site-form    create    critical

    # Generate unique site name
    ${unique_name}=    Get Unique Test Data    RobotSite

    # Open form and create site
    Click    ${ADD_SITE_BUTTON}
    Wait For Elements State    ${SITE_FORM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    Fill Text    ${NAME_INPUT}    ${unique_name}
    Fill Text    ${LOCATION_INPUT}    Test City, Country
    Fill Text    ${CAPACITY_INPUT}    1234
    Select Options By    ${STATUS_SELECT}    text    MAINTENANCE
    Click    ${SUBMIT_BUTTON}

    # Verify site appears in list
    Go To Sites Page
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    Verify Site In List    ${unique_name}


Validation Error On Empty Name
    [Documentation]    Verify validation error when name field is empty
    [Tags]    site-form    validation    negative

    Click    ${ADD_SITE_BUTTON}
    Wait For Elements State    ${SITE_FORM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Leave name empty
    Fill Text    ${NAME_INPUT}    ${EMPTY}
    Fill Text    ${LOCATION_INPUT}    Test City
    Fill Text    ${CAPACITY_INPUT}    100
    Click    ${SUBMIT_BUTTON}

    # Verify error message
    Wait For Elements State    ${ERROR_MESSAGE_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${error_text}=    Get Text    ${ERROR_MESSAGE_SELECTOR}
    Should Contain    ${error_text}    name    ignore_case=True


*** Keywords ***
Go To Sites Page
    [Documentation]    Navigate to the sites list page
    New Page    ${FRONTEND_URL}
    Wait For Load State    networkidle
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
