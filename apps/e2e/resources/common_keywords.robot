*** Settings ***
Documentation     Common reusable keywords for E2E tests
Library           Browser
Library           OperatingSystem
Library           String
Library           DateTime


*** Keywords ***
Setup Browser For Tests
    [Documentation]    Initialize browser with common settings for all tests
    New Browser    ${BROWSER}    headless=${HEADLESS}    slowMo=${SLOW_MO}
    New Context    viewport={'width': 1920, 'height': 1080}
    Set Browser Timeout    ${DEFAULT_TIMEOUT}


Navigate To Sites List Page
    [Documentation]    Navigate to the sites list page
    New Page    ${FRONTEND_URL}
    Wait For Load State    networkidle
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}


Take Screenshot On Failure
    [Documentation]    Take a screenshot if the test fails
    Run Keyword If Test Failed    Take Screenshot    fullPage=True


Verify API Is Running
    [Documentation]    Check that the FastAPI backend is accessible and returns 2xx status
    [Arguments]    ${timeout}=${LONG_TIMEOUT}

    ${response}=    Http    ${API_URL}/health    method=GET    timeout=${timeout}

    # Verify 2xx status code (200-299)
    Should Be True    ${response.status} >= 200 and ${response.status} < 300
    ...    msg=API health check failed with status ${response.status}
    Should Be Equal As Strings    ${response.body.status}    ok


Verify Frontend Is Running
    [Documentation]    Check that the Angular frontend is accessible
    [Arguments]    ${timeout}=${LONG_TIMEOUT}

    ${previous_timeout}=    Set Browser Timeout    ${timeout}
    TRY
        New Page    ${FRONTEND_URL}
        Wait For Load State    domcontentloaded
    EXCEPT    AS    ${error}
        Fail    Frontend is not accessible at ${FRONTEND_URL}: ${error}
    FINALLY
        Set Browser Timeout    ${previous_timeout}
    END


Wait For Element And Click
    [Documentation]    Wait for element to be visible and clickable, then click it
    [Arguments]    ${selector}    ${timeout}=${DEFAULT_TIMEOUT}

    Wait For Elements State    ${selector}    visible    timeout=${timeout}
    Wait For Elements State    ${selector}    enabled    timeout=${timeout}
    Click    ${selector}


Fill Text And Verify
    [Documentation]    Fill text field and verify the value was set correctly
    [Arguments]    ${selector}    ${text}

    Fill Text    ${selector}    ${text}
    ${value}=    Get Property    ${selector}    value
    Should Be Equal As Strings    ${value}    ${text}


Get Unique Timestamp
    [Documentation]    Generate a unique timestamp (ms) for test data
    ${timestamp}=    Get Time    epoch
    ${millis}=    Evaluate    int(${timestamp} * 1000)
    ${timestamp}=    Set Variable    ${millis}
    RETURN    ${timestamp}


Generate Random String
    [Documentation]    Generate a random string of specified length for test data
    [Arguments]    ${length}=8
    ${random_string}=    Evaluate    ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=${length}))    modules=random
    RETURN    ${random_string}


Get Unique Test Data
    [Documentation]    Generate unique test data combining timestamp and random string
    [Arguments]    ${prefix}=Test
    ${timestamp}=    Get Unique Timestamp
    ${random}=    Generate Random String    length=6
    ${unique_data}=    Set Variable    ${prefix}_${timestamp}_${random}
    RETURN    ${unique_data}


Clear Browser Data
    [Documentation]    Clear cookies, local storage, and session storage
    Evaluate JavaScript    ${None}    window.localStorage.clear()
    Evaluate JavaScript    ${None}    window.sessionStorage.clear()


Wait For API Response
    [Documentation]    Wait for specific API call to complete (using network monitoring)
    [Arguments]    ${url_pattern}    ${timeout}=${DEFAULT_TIMEOUT}

    ${promise}=    Promise To Wait For Response    ${url_pattern}    timeout=${timeout}
    ${response}=    Wait For    ${promise}
    RETURN    ${response}


Verify Element Text Contains
    [Documentation]    Verify that element contains specific text (case-insensitive)
    [Arguments]    ${selector}    ${expected_text}    ${ignore_case}=${True}

    ${actual_text}=    Get Text    ${selector}
    Run Keyword If    ${ignore_case}
    ...    Should Contain    ${actual_text.lower()}    ${expected_text.lower()}
    ...    ELSE
    ...    Should Contain    ${actual_text}    ${expected_text}


Verify Site In List
    [Documentation]    Verify that a site with given name exists in the sites list
    [Arguments]    ${site_name}

    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${list_text}=    Get Text    ${SITES_LIST_SELECTOR}
    Should Contain    ${list_text}    ${site_name}


Get Site Count
    [Documentation]    Get the total number of sites displayed in the list
    Wait For Elements State    ${SITE_ITEM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${count}=    Get Element Count    ${SITE_ITEM_SELECTOR}
    RETURN    ${count}


Reload Page And Wait
    [Documentation]    Reload the current page and wait for it to load
    Reload
    Wait For Load State    networkidle
