@smoke
Feature: Guess the word
  The word guess game is a turn-based game for two players.
  As a player
  I want to guess the secret word
  So that I can win the game

  Background: Common setup
    Given a logged in user

  @fast
  Scenario: Maker starts a game

    A Maker can start a new game at any time.

    Given the Maker has started a game
    And the board is empty
    When the Maker starts a game
    But no Breaker has joined yet
    Then the Maker waits for a Breaker to join
    * the game should be in progress

  Scenario Outline: Eating cucumbers
    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

    Examples:
      | start | eat | left |
      |    12 |   5 |    7 |

  Scenario: Publishing a post
    Given a post with body:
      """
      This is the body
      of the post.
      """
    # a trailing comment

  Rule: Refunds go back to stock

    @slow
    Scenario: Refunded items are restocked
      Given a customer buys a "Blue Suede" shoe
      When they return the shoe
      Then the shoe should be returned to stock

  Rule: Out of stock items are not sellable

    Scenario: Cannot sell an out of stock item
      Given an item is out of stock
      Then it should not be sellable
