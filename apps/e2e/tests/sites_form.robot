*** Settings ***
Documentation     Test suite for Site Creation Form
...               Verifies that users can create new sites via the form,
...               validates required fields, and checks error handling.

Resource          ../config.robot
Resource          ../resources/common_keywords.robot

Suite Setup       Setup Browser For Tests
Suite Teardown    Close Browser    ALL
Test Setup        Navigate To Site Creation Form
Test Teardown     Take Screenshot On Failure


*** Test Cases ***
TC06: Site Creation Form Opens Successfully
    [Documentation]    Verify that clicking "Add Site" button opens the creation form
    [Tags]    smoke    site-form

    Wait For Elements State    ${SITE_FORM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    Get Text    css=h2    ==    Add New Site


TC07: Create New Site With Valid Data
    [Documentation]    Verify that a new site can be created with all valid fields
    [Tags]    site-form    create    critical

    # Generate unique site name to avoid conflicts
    ${unique_name}=    Get Unique Test Data    ${VALID_SITE_NAME}

    # Fill in the form
    Fill Site Form    ${unique_name}    ${VALID_LOCATION}    ${VALID_CAPACITY}    ${VALID_STATUS}

    # Submit the form
    Click    ${SUBMIT_BUTTON}

    # Wait for success message or redirect to list
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Verify the new site appears in the list
    Navigate To Sites List Page
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    Verify Site In List    ${unique_name}

    # Verify total count increased to 4 (3 seeded + 1 new)
    ${count}=    Get Element Count    ${SITE_ITEM_SELECTOR}
    Should Be Equal As Integers    ${count}    4


TC08: Validation Error For Empty Site Name
    [Documentation]    Verify that submitting without a name shows validation error
    [Tags]    site-form    validation    negative

    # Leave name empty, fill other fields
    Fill Text    ${LOCATION_INPUT}    ${VALID_LOCATION}
    Fill Text    ${CAPACITY_INPUT}    ${VALID_CAPACITY}
    Select Options By    ${STATUS_SELECT}    text    ${VALID_STATUS}

    # Try to submit
    Click    ${SUBMIT_BUTTON}

    # Verify error message appears
    Wait For Elements State    ${ERROR_MESSAGE_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${error_text}=    Get Text    ${ERROR_MESSAGE_SELECTOR}
    Should Contain    ${error_text}    name    ignore_case=True
    Should Contain Any    ${error_text}    required    mandatory    cannot be empty


TC09: Validation Error For Empty Location
    [Documentation]    Verify that submitting without a location shows validation error
    [Tags]    site-form    validation    negative

    Fill Text    ${NAME_INPUT}    ${VALID_SITE_NAME}
    # Leave location empty
    Fill Text    ${CAPACITY_INPUT}    ${VALID_CAPACITY}
    Select Options By    ${STATUS_SELECT}    text    ${VALID_STATUS}

    Click    ${SUBMIT_BUTTON}

    Wait For Elements State    ${ERROR_MESSAGE_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${error_text}=    Get Text    ${ERROR_MESSAGE_SELECTOR}
    Should Contain    ${error_text}    location    ignore_case=True


TC10: Validation Error For Invalid Capacity
    [Documentation]    Verify that negative or zero capacity shows validation error
    [Tags]    site-form    validation    negative

    Fill Text    ${NAME_INPUT}    ${VALID_SITE_NAME}
    Fill Text    ${LOCATION_INPUT}    ${VALID_LOCATION}
    Fill Text    ${CAPACITY_INPUT}    -100    # Invalid negative value
    Select Options By    ${STATUS_SELECT}    text    ${VALID_STATUS}

    Click    ${SUBMIT_BUTTON}

    Wait For Elements State    ${ERROR_MESSAGE_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}
    ${error_text}=    Get Text    ${ERROR_MESSAGE_SELECTOR}
    Should Contain    ${error_text}    capacity    ignore_case=True


TC11: Cancel Button Returns To Sites List
    [Documentation]    Verify that clicking Cancel returns to sites list without saving
    [Tags]    site-form    navigation

    Fill Text    ${NAME_INPUT}    Should Not Be Saved
    Fill Text    ${LOCATION_INPUT}    ${VALID_LOCATION}

    Click    ${CANCEL_BUTTON}

    # Should return to sites list
    Wait For Elements State    ${SITES_LIST_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}

    # Verify the entered site name is NOT in the list
    ${list_text}=    Get Text    ${SITES_LIST_SELECTOR}
    Should Not Contain    ${list_text}    Should Not Be Saved


TC12: Form Fields Accept Valid Input
    [Documentation]    Verify all form fields accept and display valid input correctly
    [Tags]    site-form    input-validation

    # Name field
    Fill Text    ${NAME_INPUT}    Solar Farm XYZ
    Get Property    ${NAME_INPUT}    value    ==    Solar Farm XYZ

    # Location field
    Fill Text    ${LOCATION_INPUT}    Berlin, Germany
    Get Property    ${LOCATION_INPUT}    value    ==    Berlin, Germany

    # Capacity field (should accept numbers)
    Fill Text    ${CAPACITY_INPUT}    3500
    Get Property    ${CAPACITY_INPUT}    value    ==    3500

    # Status dropdown
    Select Options By    ${STATUS_SELECT}    text    MAINTENANCE
    ${selected}=    Get Selected Options    ${STATUS_SELECT}
    Should Contain    ${selected}[0][label]    MAINTENANCE


*** Keywords ***
Navigate To Site Creation Form
    [Documentation]    Navigate to sites list and open the creation form
    New Page    ${FRONTEND_URL}
    Wait For Load State    networkidle
    Wait For Elements State    ${ADD_SITE_BUTTON}    visible    timeout=${DEFAULT_TIMEOUT}
    Click    ${ADD_SITE_BUTTON}
    Wait For Elements State    ${SITE_FORM_SELECTOR}    visible    timeout=${DEFAULT_TIMEOUT}


Fill Site Form
    [Documentation]    Fill all fields in the site creation form
    [Arguments]    ${name}    ${location}    ${capacity}    ${status}

    Fill Text    ${NAME_INPUT}    ${name}
    Fill Text    ${LOCATION_INPUT}    ${location}
    Fill Text    ${CAPACITY_INPUT}    ${capacity}
    Select Options By    ${STATUS_SELECT}    text    ${status}


Should Contain Any
    [Documentation]    Verify that text contains at least one of the provided strings
    [Arguments]    ${actual}    @{expected}

    ${contains_any}=    Set Variable    ${False}
    FOR    ${expected_text}    IN    @{expected}
        ${status}=    Run Keyword And Return Status
        ...    Should Contain    ${actual}    ${expected_text}    ignore_case=True
        IF    ${status}
            ${contains_any}=    Set Variable    ${True}
            BREAK
        END
    END

    Should Be True    ${contains_any}
    ...    msg=Text "${actual}" does not contain any of: ${expected}
