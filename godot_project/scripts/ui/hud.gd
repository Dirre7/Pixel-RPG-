extends CanvasLayer

@onready var hp_bar: ProgressBar = $MarginContainer/VBoxContainer/HPContainer/HPBar
@onready var mp_bar: ProgressBar = $MarginContainer/VBoxContainer/MPContainer/MPBar
@onready var hp_label: Label = $MarginContainer/VBoxContainer/HPContainer/HPLabel
@onready var mp_label: Label = $MarginContainer/VBoxContainer/MPContainer/MPLabel

var current_hp: int = 100
var max_hp: int = 100
var current_mp: int = 50
var max_mp: int = 50

func _ready() -> void:
	_update_hud()

func _update_hud() -> void:
	if hp_bar:
		hp_bar.max_value = max_hp
		hp_bar.value = current_hp
	if hp_label:
		hp_label.text = "HP: %d/%d" % [current_hp, max_hp]
	if mp_bar:
		mp_bar.max_value = max_mp
		mp_bar.value = current_mp
	if mp_label:
		mp_label.text = "MP: %d/%d" % [current_mp, max_mp]
