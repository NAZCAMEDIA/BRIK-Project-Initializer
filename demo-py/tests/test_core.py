from brik_demo.core import add, is_even, clamp01


def test_add():
    assert add(2, 3) == 5


def test_is_even_true():
    assert is_even(4) is True


def test_is_even_false():
    assert is_even(5) is False


def test_clamp01_low():
    assert clamp01(-1.0) == 0.0


def test_clamp01_high():
    assert clamp01(2.0) == 1.0


def test_clamp01_mid():
    assert clamp01(0.5) == 0.5
