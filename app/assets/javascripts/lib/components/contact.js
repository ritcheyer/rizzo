/* this setting is set to avoid jshint error in ajax parameter */
/*jshint camelcase: false */

define([
  "jquery",
  "lib/utils/alert"
], function($, Alert) {

  "use strict";

  function Contact() {
    this.$friendshipBtn = $(".js-friendship-button");
    this.$friendshipBtnStatus = $(".js-friendship-button-status");

    this.$blacklistBtn = $(".js-blacklist-button");
    this.$blacklistBtnStatus = $(".js-blacklist-button-status");

    this.friendshipUrl = "/friendships/" + this.$friendshipBtn.data("user-id");
    this.blacklistUrl = "/blacklists/" + this.$blacklistBtn.data("user-id");

    this.username = this.$friendshipBtn.data("username");

    (this.$friendshipBtn.length || this.$blacklistBtn.length) && this.init();
  }

  Contact.prototype.init = function() {
    this.alert = new Alert();
    this.initButtons();
    this.listen();
  };

  //------------------------------------------------------------
  // Listen
  //------------------------------------------------------------

  Contact.prototype.listen = function() {
    var _this = this,
        method;

    this.$friendshipBtn.on("click", function(e) {
      e.preventDefault();
      method = $(this).attr("method");

      if (method == "delete") { _this.remove(); }
      if (method == "post") { _this.add(); }
    });

    this.$blacklistBtn.on("click", function(e) {
      e.preventDefault();
      method = $(this).attr("method");

      if (method == "delete") { _this.unblock(); }
      if (method == "post") { _this.block(); }
    });
  };

  //------------------------------------------------------------
  // Request
  //------------------------------------------------------------

  Contact.prototype.initButtons = function() {
    $.ajax({
      type: "GET",
      url: this.friendshipUrl,
      dataType: "json",
      success: this._btnRemove.bind(this),
      error: this._btnAdd.bind(this),
    });

    $.ajax({
      type: "GET",
      url: this.blacklistUrl,
      dataType: "json",
      success: this._btnUnblock.bind(this),
      error: this._btnBlock.bind(this),
    });
  };

  Contact.prototype.add = function() {
    this._btnLoading();
    $.ajax({
      type: "POST",
      url: "/friendships",
      dataType: "json",
      data: $.param({ friendship: { friend_id: this.$friendshipBtn.data("user-id") } }),
      success: this._added.bind(this),
      error: this._notAdded.bind(this),
    });
  };

  Contact.prototype.remove = function() {
    this._btnLoading();
    $.ajax({
      type: "DELETE",
      url: this.friendshipUrl,
      success: this._removed.bind(this),
      error: this._notRemoved.bind(this),
    });
  };

  Contact.prototype.block = function() {
    $.ajax({
      type: "POST",
      url: "/blacklists",
      dataType: "json",
      data: $.param({ blacklist: { blacklisted_user_id: this.$blacklistBtn.data("user-id") } }),
      success: this._blocked.bind(this),
      error: this._notBlocked.bind(this),
    });
  };

  Contact.prototype.unblock = function() {
    $.ajax({
      type: "DELETE",
      url: this.blacklistUrl,
      success: this._unblocked.bind(this),
      error: this._notUnblocked.bind(this),
    });
  };

  //------------------------------------------------------------
  // Flash message feedback
  //------------------------------------------------------------

  // success

  Contact.prototype._added = function() {
    this.alert.success({ title: "Success! ", content: "You've added " + this.username + " to your contacts" });
    this._btnRemove();
    this._btnBlock();
  };

  Contact.prototype._removed = function() {
    this.alert.success({ title: "Success! ", content: "You've removed " + this.username + " from your contacts" });
    this._btnAdd();
  };

  Contact.prototype._blocked = function() {
    this.alert.success({ title: "Success! ", content: "You've blocked " + this.username });
    this._btnUnblock();
    this._btnAdd();
  };

  Contact.prototype._unblocked = function() {
    this.alert.success({ title: "Success! ", content: "You've unblocked " + this.username });
    this._btnBlock();
  };

  // error

  Contact.prototype._notAdded = function() {
    this.alert.error({ title: "Oops! ", content: "Couldn't add " + this.username + " to your contacts. Please refresh the page and try again" });
  };

  Contact.prototype._notRemoved = function() {
    this.alert.error({ title: "Oops! ", content: "Couldn't remove " + this.username + " from your contacts. Please refresh the page and try again" });
  };

  Contact.prototype._notBlocked = function() {
    this.alert.error({ title: "Oops! ", content: "Couldn't block " + this.username + ". Please refresh the page and try again" });
  };

  Contact.prototype._notUnblocked = function() {
    this.alert.error({ title: "Oops! ", content: "Couldn't unblock " + this.username + ". Please refresh the page and try again" });
  };

  //------------------------------------------------------------
  // Set button status
  //------------------------------------------------------------

  Contact.prototype._btnRemove = function() {
    var $this = this;

    function addAddedFriendStyle(obj) {
      obj
      .removeClass("is-loading icon--add--before icon--white--before btn--red icon--cross--before icon--custom--before")
      .addClass("btn--subtle icon--body-grey icon--chevron-down--before")
      .attr("method", "delete")
      .removeAttr("disabled");

      $this.$friendshipBtnStatus.text("Added to contacts");
    }

    function addRemoveFriendStyle(obj) {
      obj
      .removeClass("btn--subtle icon--body-grey icon--chevron-down--before")
      .addClass("btn--red icon--cross--before icon--custom--before");

      $this.$friendshipBtnStatus.text("Remove");
    }

    addAddedFriendStyle(this.$friendshipBtn);

    this.$friendshipBtn
      .on("mouseenter", function() {
        addRemoveFriendStyle($(this));
      })
      .on("mouseleave", function() {
        addAddedFriendStyle($(this));
      });
  };

  Contact.prototype._btnAdd = function() {
    this.$friendshipBtn
      .removeClass("is-loading btn--red icon--cross--before")
      .addClass("icon--add--before")
      .attr("method", "post")
      .removeAttr("disabled");

    this.$friendshipBtnStatus.text("Add to contacts");
  };

  Contact.prototype._btnBlock = function() {
    this.$blacklistBtn
      .removeClass("icon--tick--before")
      .addClass("icon--block--before")
      .attr("method", "post");

    this.$blacklistBtnStatus.text("Block user");
  };

  Contact.prototype._btnUnblock = function() {
    this.$blacklistBtn
      .removeClass("icon--block--before")
      .addClass("icon--tick--before")
      .attr("method", "delete");

    this.$blacklistBtnStatus.text("Unblock user");
  };

  Contact.prototype._btnLoading = function() {
    var _this = this;

    this.$friendshipBtn.attr("disabled", true);
    setTimeout(function() {
      _this.$friendshipBtn
        .removeClass("icon--add--before icon--cross--before btn--red")
        .addClass("is-loading")
        .removeAttr("method");
    }, 50);
  };

  //------------------------------------------------------------
  // Self-initialize
  //------------------------------------------------------------

  new Contact();

  return Contact;
});
